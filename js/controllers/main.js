(function(){
  'use strict';

  angular.module('interprestStandalone.controllers.main', [])
  .controller( 'MainCtrl', [
    '$rootScope',
    '$mdSidenav',
    function MainController(
      $rootScope,
      $mdSidenav
    ) {
      var main = this;
      main.toggleSideNav = toggleSideNav;

      function toggleSideNav() {
        $mdSidenav('left').toggle();
      }

      $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
          main.selected = toState.name;
          $mdSidenav('left').close();
        });
      }
  ]);
})();
