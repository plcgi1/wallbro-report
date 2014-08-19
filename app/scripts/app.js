'use strict';

/**
 * @ngdoc overview
 * @name report
 * @description
 * # report let to load report data for users
 *
 * Main module of the application.
 */
(function() {
	var a = angular.module('report',
		['ngRoute', 'report.controllers','ui.bootstrap','plcgi.eventbus','angularFileUpload']
	);
	window.app = a;
	window.app.controllers = angular.module('report.controllers', ['ui.bootstrap','plcgi.eventbus','angularFileUpload']);

	window.app.config(function($routeProvider, $httpProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'views/report.html',
			controller: 'ReportCtrl'
		}).
        
		otherwise({
			redirectTo: '/'
		});
		var interceptor = ['$rootScope', '$q', 'appLoading', function(scope, $q, appLoading) {
			function success(response) {
				appLoading.ready();
				//$('#alert').html('');
				//console.log(response);
				return response;
			}

			function error(response) {
				var status = response.status;

				//var res = $('#alert');
				var arr = [];

				for (var item in response.data) {
					arr.push('<div class="alert alert-error">' + response.data[item].message + '</div>');
				}
				if (status !== 404) {
					//$('#alert').html(arr.join(''));
				}

				// otherwise
				appLoading.ready();
				return $q.reject(response);
			}
			
			return function(promise) {
				appLoading.loading();
				return promise.then(success, error);
			};
		}];
		$httpProvider.responseInterceptors.push(interceptor);
	}).factory('appLoading', function($rootScope) {
		var timer;
		return {
			loading: function() {
				clearTimeout(timer);
				$rootScope.status = 'loading';
				if (!$rootScope.$$phase) {
					$rootScope.$apply();
				}
			},
			ready: function(delay) {
				function ready() {
					$rootScope.status = 'ready';
					if (!$rootScope.$$phase) {
						$rootScope.$apply();
					}
				}

				clearTimeout(timer);
				delay = delay === null ? 500 : false;
				if (delay) {
					timer = setTimeout(ready, delay);
				} else {
					ready();
				}
			}
		};
	});

})();
