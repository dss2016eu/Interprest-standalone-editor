(function(){
  'use strict';

  angular.module("interprestStandalone.controllers", [
    'interprestStandalone.controllers.main',
    'interprestStandalone.controllers.home',
    'interprestStandalone.controllers.event',
    'interprestStandalone.controllers.post',
    'interprestStandalone.controllers.image',
  ])
  .config([
		'$stateProvider',
		function config(
			$stateProvider
		) {
			$stateProvider.state( 'main', {
				url: '/',
				abstract: true,
				controller: 'MainCtrl as main',
				templateUrl: 'templates/index.html'
			})
			.state( 'main.home', {
				url: '',
				controller: 'HomeCtrl as vm',
				templateUrl: 'templates/home.html'
			})
      .state( 'main.event', {
        url: 'events',
        controller: 'EventCtrl as vm',
        templateUrl: 'templates/event.html',
        resolve: {
          events: ['Event', function(Event){
            return Event.all();
          }]
        }
      })
      .state( 'main.eventDetails', {
        url: 'events/:id',
        abstract: true,
        controller: 'eventDetailsCtrl as vm',
        templateUrl: 'templates/event-details.html',
        resolve: {
          event: ['Event','$stateParams', function(Event, $stateParams){
            return Event.one($stateParams.id);
          }]
        }
      })
      .state( 'main.eventDetails.posts', {
        url: '',
        templateUrl: 'templates/event-details-posts.html'
      })
      .state( 'main.eventDetails.newPost', {
        url: '/post',
        controller:'PostDialogController as vm',
        templateUrl: 'templates/event-details-newpost.html'
      });
    }
  ]);

})();
