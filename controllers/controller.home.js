var controllers = angular.module('controllers-home', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('homeController', ['$rootScope', '$scope', 'chromecastService', 'subsonicService', function($rootScope, $scope, chromecastService, subsonicService) {
	console.log('home-controller')

	
	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
    $(".content").css("display", "block");
    

    $rootScope.$on('loginStatusChange', function (event, data) {
     //   var castPlayer = new CastPlayer();
       // window['__onGCastApiAvailable'] = function (isAvailable) {
         //   if (isAvailable) {
            //    castPlayer.initializeCastPlayer();
           // }
        //};

    });
}]);