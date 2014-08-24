(function() {
	/* example from developers - work at once*/
	'use strict';
	var app = window.app;
	app.controllers.controller('UploadCtrl', function($scope, $http, FileUploader) {
		$scope.$on('reportDataReady',function(evt,report_id){
			$scope.report_id 	= report_id;
		});
		
		var uploader = $scope.uploader = new FileUploader({
            url: 'rest.php?action=upload&report_id='+$scope.report_id
        });
		if ($scope.report_id || typeof $scope.report_id != 'undefined' ) {
			$http.get('rest.php?action=get_report_files&report_id='+$scope.report_id).success(function(data) {
				for(var i=0;i<data.files.length;i++){
					var item = data.files[i];
					var name = item.name.split('/');
					name = name[name.length-1];
					var dummy = new FileUploader.FileItem(uploader, {
						lastModifiedDate: new Date(),
						size: item.size,
						type: item.type,
						name: name
					});
					dummy.id = item.id;
					dummy.progress = 100;
					dummy.isUploaded = true;
					dummy.isSuccess = true;
					
					uploader.queue.push(dummy);
				}
			});
		}
		function remove(item){
			$http.get('rest.php?action=remove_report_file&id='+item.id).success(function() {
				item.remove();
			});
		}
		$scope.remove = remove;
		// FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
	
        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
		uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
	});
})();