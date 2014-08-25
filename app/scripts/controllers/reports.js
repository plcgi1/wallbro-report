(function() {
	'use strict';
	var app = window.app;
	app.controllers.controller('ReportsCtrl', function($scope, $http) {
		$scope.max_size = 10;
		$scope.per_page = 3;
		$scope.current_page = 1;        
        // getting data from server about categories
		$http.get('rest.php?action=reports').success(function(data) {
			$scope.total_items = data.total;
            $scope.data        = data.data;
		});		
		// report data array
		$scope.data = [];
		
        $scope.setPage = function (page_no) {
			$scope.current_page = page_no;
		};
		$scope.pageChanged = function() {
			$http.get('rest.php?action=reports&page='+$scope.current_page).success(function(data) {
				$scope.data        = data.data;
			});
		};		
	});
})();
