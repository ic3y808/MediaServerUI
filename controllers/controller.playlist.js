var controllers = angular.module('controllers-playlist', []);
$(".content").css("display", "none");
$(".loader").css("display", "block");
controllers.controller('playlistController', ['$rootScope', '$scope', '$sce', 'subsonicService', function($rootScope, $scope, $sce, subsonicService) {
	console.log('playlist-controller')

	$scope.config = {
        sources: [
            {
                src: $sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.mp4'),
                type: 'video/mp4'
            },
            {
                src: $sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.webm'),
                type: 'video/webm'
            },
            {
                src: $sce.trustAsResourceUrl('http://static.videogular.com/assets/videos/videogular.ogg'),
                type: 'video/ogg'
            }
        ],
        tracks: [
            {
                src: 'http://www.videogular.com/assets/subs/pale-blue-dot.vtt',
                kind: 'subtitles',
                srclang: 'en',
                label: 'English',
                default: ''
            }
        ],
        theme: 'bower_components/videogular-themes-default/videogular.css',
        plugins: {
            poster: 'http://www.videogular.com/assets/images/videogular.png'
        }
    };


	if($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
	$(".loader").css("display", "none");
	$(".content").css("display", "block");
}]);

