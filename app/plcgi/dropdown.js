// <dropdown label="" target="" model="" class="pull-right"></dropdown>
/*
	@dependencies: angular.js,angular-resource.js
	@description: <dropdown model="" class="pull-right"></dropdown>
		{
			"loginStatus" : "1",
			"login" : "harper",
			"id" : "1",
			"fio" : "Alex Nosoff"
		}
*/
var module = angular.module('plcgi.dropdown', ['ngResource']);

module.controller('DropdownCtrl',function ($scope, $element, $attrs,$resource,$route,$rootScope,EventBus){
	var url = $element.parent()[0].attributes.model.value;
	var rc  = $resource(url, {}, {query: {method:'GET', isArray:false}});
	$scope.model = rc.query(
		{},
		function(res){
			$rootScope.user = $scope.model;
			EventBus.prepForBroadcast('userDataLoaded','user',res);
		},
		function (data) {
			console.log('errr');
			console.log(data);
			$scope.model.loginStatus = 0;
		}
	);
	
	
});

module.directive('dropdown', function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: true,
        templateUrl: 'views/lib/dropdown.html',
		link: function($scope,$el,$attrs){
			$scope.loginPath = $attrs.loginPath;
			$scope.logoutPath = $attrs.logoutPath;
		}
    };
});