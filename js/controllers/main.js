(function(){
  'use strict';

  angular.module('interprestStandalone.controllers.main', [])
  .controller( 'MainCtrl', [
    '$rootScope',
    '$mdSidenav',
    'Config',
    '$window',
    function MainController(
      $rootScope,
      $mdSidenav,
      Config,
      $window
    ) {
      var main = this;
      main.toggleSideNav = toggleSideNav;
      main.setLang = setLang;
      main.currentLang = Config.getLang();
      main.dummy = 0;

      function setLang(){
        Config.setLang(main.currentLang);
        $window.location.reload();
      }

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
