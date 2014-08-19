/**
 * @name Location
 *
 * @description Parse query string params into javascript object
 * @example
 *  in your controller:
 *       function YourController($scope,$http,$routeParams,Location) {
 *           console.log(Location.param('id'));
 *       }
 *       UsersCtrl.$inject = ['$scope', '$http', 'Location'];
 *  in your browser
 *      http://yourhost/yorpage.html?id=BLABLA
 */
var module = angular.module('plcgi.mode', ['plcgi.location']);
module.factory('Mode', function(Location,$routeParams) {
	'use strict';
    var Mode = {
        get: function(attrs) {
			var res = Location.param('mode') || $routeParams.mode || attrs.mode || 'view';
			return res;
        }
    };
    return Mode;
});