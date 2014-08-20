(function() {
	'use strict';
	var app = window.app;
	app.controllers.controller('ReportCtrl', function($scope, $http, $modal) {
		// report data array
		$scope.data = [];
		// current row for report
		$scope.row = {};
		
		$scope.campaign = {};
		$scope.total    = 0;
		// getting data from server about categories
		$http.get('data/categories.json').success(function(data) {
			$scope.categories = data;
		});
		
		// getting data from server about campaign names
		$http.get('data/campaign-names.json').success(function(data) {
			$scope.campaigns = data;
		});
		
		// calculate value from cells
		$scope.calculate = function(a,b){
			if( a && b ) {
			     var res = parseFloat(a*b);
			     $scope.total = $scope.total + res;
			     return res;
			}
			return 0;
		};
		// Generate four random hex digits.
		function S4() {
		   return (((1+Math.random())*0x10000)).toString(16).substring(1);
		}
		
		// Generate a pseudo-GUID by concatenating random hexadecimal.
		function guid() {
		   return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
		}
		
		// var for dialog instance
		var modalInstance;
		function setCampaignTitle(){
			angular.forEach($scope.campaigns,function(item){
				if ($scope.campaign === item.id ) {
					$scope.campaign_title = item.name;
					return;
				}
			});
		}
		// show dialog with create-edit data
		function show_edit(row) {
			if ( row ) {
				$scope.edit = 1;
				$scope.row = row;
			}
			else {
				$scope.row = { id : guid() };
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
		
		// save data to server
		function save(){
			var edit = false;
			var index = 0;
			for( var i=0;i<$scope.data.length;i++ ) {
				if ( $scope.data[i].id === $scope.row.id ) {
					$scope.data[i] = $scope.row;
					index = i;	
					edit = true;
					break;
				}
			}
			// set category name to table sells with report data
			angular.forEach($scope.categories,function(item){
				if ($scope.row.category === item.id ) {
					$scope.row.category_title = item.name;
					return;
				}
			});
			if (!edit) {
				$scope.data.push($scope.row);
			}
			$scope.row = {};
			modalInstance.close();
		}
		
		$scope.show_edit = show_edit;
		$scope.setCampaignTitle = setCampaignTitle;
		var RowDlgCtrl = function($scope, $modalInstance,row,campaigns,categories) {
			$scope.row = row;
			$scope.campaigns = campaigns;
			$scope.categories = categories;
			$scope.save = save;
		};
	});
})();
