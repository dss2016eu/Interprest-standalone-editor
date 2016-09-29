(function(){
  'use strict';

  angular.module("interprestStandalone.services.config", [])
  .service('Config', ['$window', '$locale', 'i18n',function($window, $locale, i18n){
    var browserLocale = $locale.id.split('-').shift();

    if( !$window.localStorage.getItem('currentLang') && i18n.isLocaleSupported(browserLocale) ) {
      console.log("setting brwserlocale ", browserLocale);
      $window.localStorage.setItem('currentLang', browserLocale);
    } else if (!$window.localStorage.getItem('currentLang')) {
      $window.localStorage.setItem('currentLang', 'en');
    }

    this.getLang = function(){
      return $window.localStorage.getItem('currentLang');
    };
    this.setLang = function(lang){
      return $window.localStorage.setItem('currentLang', lang);
    };
  }]);
})();
