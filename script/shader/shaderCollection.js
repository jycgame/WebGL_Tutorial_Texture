define([
	'./defaultFragment',
	'./defaultVertex',
	], function(
	defaultFragment,
	defaultVertex,
	){

	var collection = [];

	collection['defaultFragment'] = defaultFragment;
	collection['defaultVertex'] = defaultVertex;

	return collection;
});
