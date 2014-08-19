angular.module("plcgi.eventbus",[]).factory("EventBus",["$rootScope",function(a){var b={};return b.model={},b.prepForBroadcast=function(b,c,d){this.model[c]=d,this.broadcastItem(b,c),a.$$phase||a.$apply()},b.broadcastItem=function(c,d){a.$broadcast(c,b.model[d])},b}]),function(){var a=angular.module("report",["ngRoute","report.controllers","ui.bootstrap","plcgi.eventbus","angularFileUpload"]);window.app=a,window.app.controllers=angular.module("report.controllers",["ui.bootstrap","plcgi.eventbus","angularFileUpload"]),window.app.config(function(a,b){a.when("/",{templateUrl:"views/report.html",controller:"ReportCtrl"}).otherwise({redirectTo:"/"});var c=["$rootScope","$q","appLoading",function(a,b,c){function d(a){return c.ready(),a}function e(a){var d=(a.status,[]);for(var e in a.data)d.push('<div class="alert alert-error">'+a.data[e].message+"</div>");return c.ready(),b.reject(a)}return function(a){return c.loading(),a.then(d,e)}}];b.responseInterceptors.push(c)}).factory("appLoading",function(a){var b;return{loading:function(){clearTimeout(b),a.status="loading",a.$$phase||a.$apply()},ready:function(c){function d(){a.status="ready",a.$$phase||a.$apply()}clearTimeout(b),c=null===c?500:!1,c?b=setTimeout(d,c):d()}}})}(),function(){"use strict";var a=window.app;a.controllers.controller("ReportCtrl",function(a,b,c){function d(){return(65536*(1+Math.random())).toString(16).substring(1)}function e(){return d()+d()+"-"+d()+"-"+d()+"-"+d()+"-"+d()+d()+d()}function f(){angular.forEach(a.campaigns,function(b){return a.campaign===b.id?void(a.campaign_title=b.name):void 0})}function g(b){b?(a.edit=1,a.row=b):(a.row={id:e()},delete a.edit),i=c.open({templateUrl:"views/lib/row.html",controller:j,scope:a,resolve:{row:function(){return a.row},campaigns:function(){return a.campaigns},categories:function(){return a.categories}}})}function h(){for(var b=!1,c=0,d=0;d<a.data.length;d++)if(a.data[d].id===a.row.id){a.data[d]=a.row,c=d,b=!0;break}angular.forEach(a.categories,function(b){return a.row.category===b.id?void(a.row.category_title=b.name):void 0}),b||a.data.push(a.row),a.row={},i.close()}a.data=[],a.row={},a.campaign={},b.get("data/categories.json").success(function(b){a.categories=b}),b.get("data/campaign-names.json").success(function(b){a.campaigns=b}),a.calculate=function(a,b){return parseFloat(a*b)};var i;a.show_edit=g,a.setCampaignTitle=f;var j=function(a,b,c,d,e){a.row=c,a.campaigns=d,a.categories=e,a.save=h}})}(),function(){"use strict";var a=window.app;a.controllers.controller("UploadCtrl",function(a,b,c){var d=a.uploader=new c({url:"upload.php"});d.filters.push({name:"imageFilter",fn:function(a){var b="|"+a.type.slice(a.type.lastIndexOf("/")+1)+"|";return-1!=="|jpg|png|jpeg|bmp|gif|".indexOf(b)}}),d.onWhenAddingFileFailed=function(a,b,c){console.info("onWhenAddingFileFailed",a,b,c)},d.onAfterAddingFile=function(a){console.info("onAfterAddingFile",a)},d.onAfterAddingAll=function(a){console.info("onAfterAddingAll",a)},d.onBeforeUploadItem=function(a){console.info("onBeforeUploadItem",a)},d.onProgressItem=function(a,b){console.info("onProgressItem",a,b)},d.onProgressAll=function(a){console.info("onProgressAll",a)},d.onSuccessItem=function(a,b,c,d){console.info("onSuccessItem",a,b,c,d)},d.onErrorItem=function(a,b,c,d){console.info("onErrorItem",a,b,c,d)},d.onCancelItem=function(a,b,c,d){console.info("onCancelItem",a,b,c,d)},d.onCompleteItem=function(a,b,c,d){console.info("onCompleteItem",a,b,c,d)},d.onCompleteAll=function(){console.info("onCompleteAll")},console.info("uploader",d)})}();