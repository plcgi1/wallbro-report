// <list model="data/projects.json"></list>

var module = angular.module('plcgi.list', ['ngResource']);

module.controller('ListCtrl',function ($scope, $element, $attrs,$resource,$route){
	var url = $element.parent()[0].attributes.model.value;
	var rc  = $resource(url, {}, {query: {method:'GET', isArray:true}});
	var data = rc.query({},function(res){
		$scope.model = data;
	});
});

module.directive('list', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        templateUrl: 'views/lib/list.html',
		link: function($element,$attrs){
			//console.log($element);
		}
    };
});