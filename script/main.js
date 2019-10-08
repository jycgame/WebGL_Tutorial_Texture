define([
    'vertexReorganizer',
    'core/defaultValue',
    'gl-matrix/gl-matrix',
    'shader/shaderCollection',
    'renderer/context',
    'renderer/Material',
    'renderer/Texture',
    ], function(
        helper,
        defaultValue,
        glMatrix,
        shaderCollection,
        Context,
        Material,
        Texture ) {
    'use strict';

    var vertices;
    var uvs;
    var indices;
    var texture;
    var modelLoaded = false;
    var textureLoaded = false;
    var modelTransform, viewTransform, projectionTransform;
    var modelPositon = glMatrix.vec3.fromValues(0, 0, 0);
    var uv;
    var coord;
    var material;

    //model transform
    modelTransform = glMatrix.mat4.create();
    glMatrix.mat4.fromTranslation(modelTransform, modelPositon);

    function clearCanvas(r, g, b, a) {
        gl.clearColor(49/255, 77/255, 121/255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    function render(timestamp) {
        clearCanvas();

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        //如果模型的顶点准备完毕，我们就可以渲染了
        if (modelLoaded && textureLoaded) {
            gl.useProgram(material.shaderProgram);

            //顶点数据（CPU到GPU）
            var vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            coord = gl.getAttribLocation(material.shaderProgram, "aVertexPosition");
            gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(coord);
    
            //贴图uv数据 (顶点属性之一)
            var textureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
            uv = gl.getAttribLocation(material.shaderProgram, "aTextureCoord");
            gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(uv);
    
            //索引数据（CPU到GPU）
            var index_buffer = gl.createBuffer ();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
            gl.viewport(0, 0, canvas.width, canvas.height);
    
            //view transform matrix
            viewTransform = glMatrix.mat4.create();
    
            var cameraPos = glMatrix.vec3.fromValues(0, 0, 50);
            var focalPoint = glMatrix.vec3.fromValues(0, 0, 0);
            var up = glMatrix.vec3.fromValues(0, 1, 0);
    
            glMatrix.mat4.lookAt(viewTransform, cameraPos, focalPoint, up);
    
            //projection transform
            projectionTransform = glMatrix.mat4.create();
            glMatrix.mat4.perspective(projectionTransform, glMatrix.glMatrix.toRadian(15), 1, 0.01, 100);
    
            material.setMatrix("modelTransform", modelTransform);
            material.setMatrix("viewTransform", viewTransform);
            material.setMatrix("projectionTransform", projectionTransform);
    
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

            gl.disableVertexAttribArray(uv);
            gl.disableVertexAttribArray(coord);
        }
    }

    // timestamp is the delta time from last time callback called. Use MS.
    function frameUpdate(timestamp) {
        //render
        render(timestamp);

        //schedule the next frame
        requestAnimationFrame(frameUpdate);
    }

    function loadVerticesFromFile(path) {
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function() {
           if (xmlHttpRequest.status == 200 && xmlHttpRequest.readyState == 4) {
              var txt = xmlHttpRequest.responseText;
 
              var lines = txt.split('\n');
 
              //ignore lines not contain vertices
              var index = 0;
              while(lines[index].indexOf('v ') == -1) {
                 index++;
              }
 
              //1， 读取顶点数据
              vertices = [];
              while(lines[index].indexOf('v ') == 0) {
                 //这里是每一个顶点数据
                 var str = lines[index];
                 var values = str.split(' ');
                   
                 vertices.push(parseFloat(values[1]));
                 vertices.push(parseFloat(values[2]));
                 vertices.push(parseFloat(values[3]));

                 index++;
              }

              //2，读取uv数据
              uvs = [];
              while(lines[index].indexOf('vt ') == 0) {
                 var str = lines[index];
                 var values = str.split(' ');

                 uvs.push(parseFloat(values[1]));
                 uvs.push(parseFloat(values[2]));
                 index++;
              }

              //3，处理法线数据
              var normals = [];
              while(lines[index].indexOf('vn ') == 0) {
                 var str = lines[index];
                 var values = str.split(' ');

                 normals.push(parseFloat(values[1]));
                 normals.push(parseFloat(values[2]));
                 normals.push(parseFloat(values[3]));
                 index++;
              }
 
              while(lines[index].indexOf('f ') == -1) {
                 index++;
              }
                
              //3，处理顶点索引：位置和UV，法线
              while(lines[index].indexOf('f ') == 0) {
                 var line = lines[index];
                 var values = line.split(' ');
 
                 if (values.length == 5) {
                    // first vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[1]);
                    // second vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[2]);
                    // third vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[3]);

                    //第二个三角形
                    // 1st vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[1]);
                    // 2nd vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[3]);
                    // 3rd vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[4]); 
                 }
                 else if(values.length == 4) {
                    // first vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[1]);
                    // second vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[2]);  
                    // third vertex
                    helper.extractAndProcessVertex(vertices, uvs, normals, values[3]);
                 }
                 else {
                    console.log("Impossible!");
                 }
 
                 index++;
              }
 
              vertices = helper.getPositionArray();
              uvs = helper.getUvArray();
              indices = helper.getIndexArray();

              modelLoaded = true;
           }
         
        }
        xmlHttpRequest.open("GET", path);
        xmlHttpRequest.send();         
     }

     loadVerticesFromFile("./model/sphere3x.obj");

    var canvas = document.getElementById('my_Canvas');
    var gl = canvas.getContext("experimental-webgl");

    texture = new Texture("./texture/uv.jpg", {gl:gl}, function(tex) {
      material = new Material({vertexShader: shaderCollection['defaultVertex'], fragShader: shaderCollection['defaultFragment'], gl: gl});
      material.setTexture("uSampler", tex);
      textureLoaded = true;
  });

    // start frame
    frameUpdate();
});