(function() {
	'use strict';
	var app = window.app;
	app.controllers.controller('ReportCtrl', function($scope, $http, $modal,$location,$routeParams,EventBus) {
		if ($routeParams.report_id || typeof $routeParams.report_id !== 'undefined' ) {
			$scope.report_id = $routeParams.report_id;
		}
		if ($scope.report_id === 'new') {
			delete $scope.report_id;
		}
		// report data array
		$scope.data = [];
		// current row for report
		$scope.row = {};
		
		$scope.companies = [];
				
		// getting data from server about categories
		$http.get('rest.php?action=categories').success(function(data) {
			$scope.categories  = data;
		});
		
		// getting data from server about campaign names
		$http.get('rest.php?action=companies').success(function(data) {
			$scope.companies = data;
		});
		
		if ( $scope.report_id || typeof $scope.report_id !== 'undefined' ) {
			$http.get('rest.php?action=get_report&id='+$scope.report_id).success(function(data) {
				
				$scope.data = data.rows;
				$scope.report_id = data.report_id;
				$scope.company_id = data.company_id;
				
				set_company_title();
				set_category_title();
				EventBus.prepForBroadcast('reportDataReady','report_id',$scope.report_id);
			});
		}
		
		function error_handler(){
			window.alert('Server error');
		}
		function calc_total(data){
			var total = 0;
			angular.forEach(data,function(item){
				total = parseFloat(total + (item.rate*item.value));
			});
			return total;
		}
		// calculate value from cells
		$scope.calculate_me = function(a,b){
			if( a && b ) {
			     var res = parseFloat(a*b);
			     return res;
			}
			return 0;
		};
		function remove_row(row){
			$http.get('rest.php?action=remove_row&id='+row.id)
					.success(function() {
						if ($scope.data && $scope.data.length>0) {
							var new_data = [];
							for( var i=0;i<$scope.data.length;i++) {
								if ( $scope.data[i].id !== row.id) {
									new_data.push($scope.data[i]);
								}
							}
							$scope.data = new_data;
						}
					})
					.error(error_handler);
		}
		// var for dialog instance
		var modalInstance;
		function set_company_title(){
			angular.forEach($scope.companies,function(item){
				if ($scope.company_id === item.id ) {
					$scope.company_title = item.name;
					return;
				}
			});
			if ( $scope.report_id || typeof $scope.report_id !== 'undefined' ) {
				$http.post('rest.php?action=change_company',{report_id : $scope.report_id, company_id : $scope.company_id})
					.success(function() {})
					.error(error_handler);
			}			
		}
		// show dialog with create-edit data
		function show_edit(row) {
			if ( row ) {
				$scope.edit = 1;
				$scope.row = row;
			}
			else {
				$scope.row = { report_id : $scope.report_id, company_id : $scope.company_id };
				delete $scope.edit;
			}
			
			modalInstance = $modal.open({
				templateUrl: 'views/lib/row.html',
				controller: RowDlgCtrl,
				scope: $scope,
				resolve: {
					row: function () {
						return $scope.row;
					},
					campaigns: function(){
						return $scope.campaigns;
					},
					categories: function(){
						return $scope.categories;
					}
				}
			});			
		}
		function set_category_title () {
			// set category name to table sells with report data
			angular.forEach($scope.categories,function(item){
				if ($scope.row.category_id === item.id ) {
					$scope.row.category_title = item.name;
					return;
				}
			});
		}
		// save data to server
		function save(){
			var edit = false;
			var index = 0;
			set_category_title($scope.category_id);
			for( var i=0;i<$scope.data.length;i++ ) {
				if ( $scope.data[i].id === $scope.row.id ) {
					$scope.data[i] = $scope.row;
					index = i;	
					edit = true;
					break;
				}
			}
			$scope.row.company_id = $scope.company_id; 
			$scope.row.report_id = $scope.report_id;
			
			// сохраняем на серваке
			$http.post('rest.php?action=save',$scope.row)
				.success(function(data) { 
					$scope.row.id = data.id;
					$scope.row.report_id = data.report_id;
					if (!edit) {
						$scope.data.push($scope.row);
						$location.url(''+data.report_id);
					}
					$scope.row = {};
					modalInstance.close();
				})
				.error(error_handler);			
		}
		
		$scope.show_edit = show_edit;
		$scope.set_company_title = set_company_title;
		$scope.remove_row = remove_row;
		
		$scope.calc_total = calc_total;
		var RowDlgCtrl = function($scope, $modalInstance,row,campaigns,categories) {
			$scope.row = row;
			$scope.campaigns = campaigns;
			$scope.categories = categories;
			$scope.save = save;
		};
	});
})();
