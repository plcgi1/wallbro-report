/**
 * @name EventBus
 *
 * @description Share data between components,directives,controllers etc. - when they loaded by ajax
 * @example
 *  Task: share data between modules
 *  in your directive or controller:
 *      ServiceName.get({}, function(data) {
            $scope.auth   	= 1;
            $scope.user     = data;
            EventBus.prepForBroadcast('userDataLoaded','user',$scope.user);
        });
			
    anywere in application
    
    $scope.$on('userDataLoaded',function(evt,user){
		$scope.user 	= user;
	});
 */
angular.module('plcgi.eventbus', []).factory('EventBus', function($rootScope) {
    var eventBus = {};

    eventBus.model = {};

    eventBus.prepForBroadcast = function(eventName,key,model) {
        this.model[key] = model;
        this.broadcastItem(eventName,key);
        if(!$rootScope.$$phase) $rootScope.$apply();
    };

    eventBus.broadcastItem = function(eventName,key) {
        $rootScope.$broadcast(eventName, eventBus.model[key]);
    };
    
    return eventBus;
});