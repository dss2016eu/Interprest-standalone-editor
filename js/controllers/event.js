(function(){
  'use strict';

  angular.module('interprestStandalone.controllers.event', [])
  .controller( 'EventCtrl', [
    'Event',
    'events',
    '$mdDialog',
    '$mdMedia',
    '$scope',
    '$state',
    function EventController(
      Event,
      events,
      $mdDialog,
      $mdMedia,
      $scope,
      $state
    ) {
      var vm = this;

      vm.events = events;
      vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      vm.openEventDetails = function(id){
        $state.go('main.eventDetails.posts', {id: id});
      };

      vm.newEvent = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
        $mdDialog.show({
          controller: 'EventDialogController as vm',
          templateUrl: 'templates/event-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: { currentEvent: null },
          resolve: {
            languages: ['Languages', function(Languages){
              return Languages.all();
            }]
          }
        })
        .then(function(newEvent) {
          vm.events.push(newEvent);
        }, function() {
          // cancelled
        });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          vm.customFullscreen = (wantsFullScreen === true);
        });
      };
    }
  ])
  .controller('eventDetailsCtrl', [
    'event',
    '$state',
    '$mdMedia',
    '$mdDialog',
    '$scope',
    '$rootScope',
    'Post',
    'Image',
    'Exporter',
    function(
      event,
      $state,
      $mdMedia,
      $mdDialog,
      $scope,
      $rootScope,
      Post,
      Image,
      Exporter
    ){
      var vm = this;
      vm.event = event;

      vm.showingPostList = ( $state.current.name === "main.eventDetails.posts" );

      vm.deleteEvent = function(){
        vm.event.delete().then(function(){
          $state.go('main.event');
        });
      };

      vm.viewLanguage = vm.event.languages[0].code;
      var originatorEv;
      this.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };


      vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
      vm.editEvent = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
        $mdDialog.show({
          controller: 'EventDialogController as vm',
          templateUrl: 'templates/event-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: { currentEvent: vm.event },
          resolve: {
            languages: ['Languages', function(Languages){
              return Languages.all();
            }]
          }
        })
        .then(function(editedEvent) {
          // nothing to do
        }, function() {
          // cancelled
        });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          vm.customFullscreen = (wantsFullScreen === true);
        });
      };

      if(vm.event.image){
        Image.one(vm.event.image).then(function(image){
          vm.eventImage = image;
        });
      }

      vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      vm.showImagesModal = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
        $mdDialog.show({
          controller: 'ImageCtrl as vm',
          templateUrl: 'templates/image-dialog.html',
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
          vm.event.image = image.id;
          vm.eventImage = image;
          saveEvent();
        }, function() {
          // cancelled
        });
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          vm.customFullscreen = (wantsFullScreen === true);
        });
      };

      function saveEvent(){
        var wat = angular.copy(vm.event);
        delete wat.posts;
        wat.save();

      }

      vm.removeImage = function(){
        vm.event.image = null;
        vm.eventImage = null;
        saveEvent();
      };

      vm.posts = function(ev) {
        $state.go('main.eventDetails.posts');
      };

      vm.newPost = function(ev) {
        vm.currentPost = null;
        $scope.post = {};
        $state.go('main.eventDetails.newPost');
      };

      vm.cancel = function() {
        vm.currentPost = null;
        $scope.post = {};
        $state.go('main.eventDetails.posts');
      };

      vm.deletePost = function(){
        vm.currentPost.delete().then(function(){
          $state.go('main.eventDetails.posts');
        });
      };

      vm.editPost = function(ev, post) {
        vm.currentPost = post;
        $scope.post = angular.copy(vm.currentPost);
        $state.go('main.eventDetails.newPost');
      };

      $scope.post = {};

      vm.savePost = function(){
        var save;
        if($scope.post.id) {
          angular.extend(vm.currentPost, $scope.post);
          save = vm.currentPost.save();
        } else {
          var newPost = new Post($scope.post);
          save = newPost.save();
        }
        save.then(function(savedPost){
          if(!$scope.post.id){
            vm.event.posts.push(savedPost);
          }
          vm.posts();
        });
      };

      vm.exportEvent = function exportEvent(){
        Exporter.export(vm.event);
      };



      $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams){
        vm.showingPostList = ( toState.name === "main.eventDetails.posts" );
      });
    }
  ])
  .controller('EventDialogController', [
    '$mdDialog',
    'Event',
    'languages',
    'currentEvent',
    function($mdDialog, Event, languages, currentEvent){
      var vm = this;
      vm.languages = languages;
      vm.readonly = false;
      vm.selectedItem = null;
      vm.searchText = null;
      vm.querySearch = querySearch;
      vm.selectedLanguages = currentEvent ? currentEvent.languages : [];
      if(currentEvent) {
        vm.event = angular.copy(currentEvent);
      } else {
        vm.event = {};
      }

      vm.cancel = function() {
        $mdDialog.cancel();
      };

      vm.saveEvent = function(){
        if(!vm.event.title) return;
        var save;
        if(vm.event.id) {
          angular.extend(currentEvent, vm.event);
          currentEvent.languages = angular.copy(vm.selectedLanguages);
          save = currentEvent.save();
        } else {
          var e = {};
          e.title = vm.event.title;
          if(vm.event.description) e.description = vm.event.description;
          e.languages = angular.copy(vm.selectedLanguages);
          var newEvent = new Event(e);
          save = newEvent.save();
        }
        save.then(function(ev){
          $mdDialog.hide(ev);
        });
      };

      vm.transformChip = transformChip;
      /**
       * Return the proper object when the append is called.
       */
      function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
          return chip;
        }
      }
      /**
       * Search for languages.
       */
      function querySearch (query) {
        var results = query ? vm.languages.filter(createFilterFor(query)) : [];
        return results;
      }

      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(language) {
          return (language._lowername.indexOf(lowercaseQuery) === 0) ||
              (language.code.indexOf(lowercaseQuery) === 0) ||
              (language._lowernative.indexOf(lowercaseQuery) === 0 );
        };
      }
    }
  ]);
})();
