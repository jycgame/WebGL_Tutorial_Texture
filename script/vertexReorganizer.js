define(function() {
    'use strict';

    //重新组织后的顶点数组和索引数组
    var verticesNew = [];
    var indicesNew = [];
    
    //顶点属性：位置
    function posAttribute(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    
        this.equals = function (pos) {
            if (this.x == pos.x && this.y == pos.y && this.z == pos.z) return true;
            return false;
        }
    }
    
    //顶点属性：uv
    function uvAttribute(u, v) {
        this.u = u;
        this.v = v;
    
        this.equals = function (uv) {
            if (this.u == uv.u && this.v == uv.v) return true;
            return false;
        }
    }
    
    //顶点属性：normal
    function normalAttribute(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    
        this.equals = function(n) {
            if (this.x == n.x && this.y == n.y && this.z == n.z) return true;
            return false;
        }
    }
    
    //顶点
    function vertex(pos, uv, normal) {
        this.pos = pos;
        this.uv = uv;
        this.normal = normal;
    
        this.equals = function (v) {
            if (this.pos.equals(v.pos) && this.uv.equals(v.uv) && this.normal.equals(v.normal)) return true;
            return false;
        }
    }
    
    // strValue，obj中的 f v/vt/vn v/vt/vn v/vt/vn 这样类似的字串中的v/vt/vn部分
    // vertices, obj中的 v
    // uvs, vt data inside obj file
    // normals vn data inside obj file
    function extractAndProcessVertex(vertices, uvs, normals, strValue) {
        var index, uvindex, norindex;
    
        var parts = strValue.split('/');
    
        index = parts[0] - 1;
        uvindex = parts[1] - 1;
        norindex = parts[2] - 1;
    
        var x = vertices[index * 3];
        var y = vertices[index * 3 + 1];
        var z = vertices[index * 3 + 2];
        var pos = new posAttribute(x, y, z);
    
        var uvu = uvs[uvindex * 2];
        var uvv = uvs[uvindex * 2 + 1];
        var uv = new uvAttribute(uvu, uvv);
    
        x = normals[norindex * 3];
        y = normals[norindex * 3 + 1];
        z = normals[norindex * 3 + 2];
        var normal = new normalAttribute(x, y, z);
    
        var v = new vertex(pos, uv, normal);
        processVertex(v);
    }
    
    // 为保证顶点的唯一性（顶点中的所有属性都一样的算是一个顶点），每一次我们在obj文件中读取到一个face部分的顶点的时候，
    // 都会需要让该方法查一下是否该顶点已经在数组中存在。存在的话只要把相关索引输出。不存在则先存入数组，再输出索引。
    // 索引是为drawElements准备的。算法复杂度上商用的时候需要狠狠优化。
    function processVertex(vertex) {
    
        var index = -1;
    
        for (var i = 0; i < verticesNew.length; ++i) {
            if (vertex.equals(verticesNew[i])) {
                index = i;
                break;
            }
        }
    
        if (index == -1) {
            verticesNew.push(vertex);
            index = verticesNew.length - 1;
        }
    
        indicesNew.push(index);
    }
    
    // 为了顶点每个属性一个ARRAY_BUFFER的使用，这里用来把顶点的uv做成数组输出
    function getUvArray() {
        var uvs = [];
    
        for (var i = 0; i < verticesNew.length; ++i) {
            uvs.push(verticesNew[i].uv.u);
            uvs.push(verticesNew[i].uv.v);
        }
    
        return uvs;
    }
    
    // 为了顶点每个属性一个ARRAY_BUFFER的使用，这里用来把顶点的position做成数组输出
    function getPositionArray() {
        var poses = [];
    
        for (var i = 0; i < verticesNew.length; ++i) {
            poses.push(verticesNew[i].pos.x);
            poses.push(verticesNew[i].pos.y);
            poses.push(verticesNew[i].pos.z);
        }
    
        return poses;
    }
    
    // 输出索引数组
    function getIndexArray() {
        return indicesNew;
    }

    return {
        extractAndProcessVertex: extractAndProcessVertex,
        getPositionArray: getPositionArray,
        getIndexArray: getIndexArray,
        getUvArray: getUvArray
    }
});
