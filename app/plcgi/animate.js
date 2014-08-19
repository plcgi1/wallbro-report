'use strict';

var module = angular.module('plcgi.animator', []);

module
//	.animation('enter-animation', function() {
//		return {
//			setup : function(element) {},
//			start : function(element, done) {},
//			cancel : function(element, done) {}
//		};
//	})
//	.animation('leave-animation', function() {
//  return {
//    setup : function(element) {},
//    start : function(element, done) {},
//    cancel : function(element, done) {}
//  };
//})
//	.animation('move-animation', function() {
//  return {
//    setup : function(element) {},
//    start : function(element, done) {},
//    cancel : function(element, done) {}
//  };
//})
//	.animation('show-animation', function() {
//  return {
//    setup : function(element) {},
//    start : function(element, done) {},
//    cancel : function(element, done) {}
//  };
//})
//	.animation('hide-animation', function() {
//  return {
//    setup : function(element) {},
//    start : function(element, done) {},
//    cancel : function(element, done) {}
//  };
//})
//	.animation('custom-animation', function() {
//  return {
//    setup : function(element) {  },
//    start : function(element, done) {  },
//    cancel : function(element, done) { }
//  };
//})
	.directive('animate',[function() {
		return {
			restrict:'A',
			replace:true,
			link : function($scope, element, attrs) {
				element.removeClass('mypage');
				element.removeClass('show');
				element.addClass('mypage');
				element.addClass('show');
				
				//var animator = $animator($scope, attrs);
				
				//console.log(animator.enter);//animator.enter(element, parent);
				
				//setTimeout(function(){
				//	element.addClass('show');
				//});
				//the attrs object is where the ngAnimate attribute is defined
				//var animator = $animator($scope, attrs);
				//
				////injects the element into the DOM then animates
				//animator.enter(element, parent); 
				//
				////animates then removes the element from the DOM
				//animator.leave(element); 
				//
				////moves it around in the DOM then animates
				//animator.move(element, parent, sibling);  
				//
				////sets CSS display=block then animates
				//animator.show(element);  
				//
				////animates then sets CSS display=none
				//animator.hide(element);  
				//
				////animates a custom animation referenced in the ngAnimate attr
				////by the event name (so ngAnimate="{custom:'animation'}")
				//animator.animate('custom', element);
			}
		};
}]);