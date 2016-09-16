(function(){
  'use strict';

  angular.module('interprestStandalone.controllers.post', [])
  .controller( 'PostDialogController', [
    '$log',
    '$scope',
    '$state',
    '$rootScope',
    '$mdDialog',
    '$mdMedia',
    'Post',
    'Image',
    'event',
    function PostDialogController(
      $log,
      $scope,
      $state,
      $rootScope,
      $mdDialog,
      $mdMedia,
      Post,
      Image,
      event
    ) {

      var vm = this;
      vm.languages = event.languages;
      if(!$scope.post.id) {
        $scope.post.eventId = parseInt(event.id);
        $scope.post.data = {};
      }
      vm.post = $scope.post;

      if(vm.post.image){
        Image.one(vm.post.image).then(function(image){
          vm.postImage = image;
        });
      }

      vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      vm.showImagesModal = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
        $mdDialog.show({
          controller: 'ImageCtrl as vm',
          templateUrl: '/templates/image-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: { currentEvent: event },
          resolve: {
            images: ['Image', function(Image){
              return Image.all();
            }]
          }
        })
        .then(function(image) {
          vm.post.image = image.id;
          vm.postImage = image;
        }, function() {
          // cancelled
        });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          vm.customFullscreen = (wantsFullScreen === true);
        });
      };

      vm.removeImage = function(){
        vm.post.image = null;
        vm.postImage = null;
      };
    }
  ]);
})();
