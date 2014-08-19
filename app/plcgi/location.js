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
var module = angular.module('plcgi.location', []);
module.factory('Location', function() {
	'use strict';
    var Location = {
        param: function(name) {
            var url = location.href;

            var qs = (url.split("?"))[1];

            if (qs) {
                var pairs = qs.split("&");
                var hash = {};
                for (var i = 0; i < pairs.length; i++) {
                    var arr = pairs[i].split('=');
                    hash[arr[0]] = arr[1];
                }

                var found = hash[name];
                if (found && typeof found != 'undefined') {
                    var res = found.length == 0 ? false : found;
                    return res;
                }
                return 0;
            }
			return null;
        }
    };
    return Location;
});