/**
 *
 * nidedit.directive - 
 * @version v0.0.1 - 2014-01-06
 * @author https://github.com/plcgi1
 * @dependencies AngularJS v1.0.6(http://angularjs.org), jquery(http://jquery.com), nicedit.js(http://nicedit.com/)
 *
 * <textarea nicedit="data/projects.json"></list>
 */

'use strict';

var module = angular.module('plcgi.toolkit', ['ngResource']);

module.directive('plcgiNicedit',['$parse','$compile',function($parse,$compile) {
	var opts = {
		buttonList : ['save','bold','italic','left','center','right','justify','ol','ul','indent','outdent','image','link' ,'unlink','fontSize' ],
		iconsPath : 'components/nicedit/nicEditorIcons.gif'
	};
	
	var editors = {};
    return {
        restrict: 'E',
		transclude : true,
		require: 'ngModel',
		scope: false,
		link: function($scope,$element,$attrs,ngModel){
			
			var ta = document.createElement("textarea");
			ta.setAttribute("ng-model", $attrs.ngModel);
			ta.setAttribute("id", $attrs.id);
			
			$(ta).addClass('textarea').appendTo($element);
			
			editors[$attrs.id] = new nicEditor(opts).panelInstance(ta);
			
			var elm = nicEditors.findEditor(ta).getElm();
			
			$scope[$attrs.ngModel] = ngModel;
			function changed () {
				var self = this;
				var selected = editors[$attrs.id].selectedInstance;
                $scope.$apply(function(){
					ngModel.$setViewValue(selected.getContent());
					selected.saveContent();
				});
				
			}
			$(elm).attr({'ng-model':$attrs.ngModel })
				.bind('focus',changed)
				.bind('keyup',changed)
				.bind('keydown',changed)
				.bind('mousedown',changed)
				.bind('mouseup',changed);
		}
    };
}]);