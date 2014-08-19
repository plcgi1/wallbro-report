// <navbar model=""/>
/*
	@dependencies: angular.js,angular-resource.js
	@description: <navbar model="/path/to/top-level-navigation-data"/>
		Data: [
			{ "label": "LABEL", "path" : "PATH" },
			...
		]
*/
var module = angular.module('plcgi.navbar', ['ngResource']);

module.controller('NavCtrl',function ($scope, $element, $attrs,$rootScope,$resource,$route,$location,EventBus){
	var url = $element.parent()[0].attributes.model.value;
	var rc  = $resource(url, {}, {query: {method:'GET', isArray:false}});
	var data = rc.query({},function(data){
		$rootScope.actions = data.actions;
		$rootScope.is_author = data.is_author;
		$rootScope.loginStatus = 1;
		$rootScope.email = data.email;
		$rootScope.balance = data.balance;
		$rootScope.subscribers_count = data.subscribers_count;
		EventBus.prepForBroadcast('userDataLoaded','user',{
			loginStatus : 1,
			email: data.email,
			is_author : data.is_author,
			subscribers_count: data.subscribers_count,
			balance : data.balance
		});
	});
	
	//switchTab({path:$location.path()});
});

module.directive('navbar', function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        templateUrl: 'views/lib/navbar.html'
    };
});