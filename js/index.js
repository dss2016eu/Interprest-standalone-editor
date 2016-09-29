(function(){
  'use strict';

  angular.module("interprestStandalone", [
    'ui.router',
    'ngMaterial',
    'ngSanitize',
    'ngAnimate',
    'indexedDB',
    'angularFileUpload',
    'interprestStandalone.controllers',
    'interprestStandalone.models',
    'interprestStandalone.services',
    'interprestStandalone.i18n'
  ])
  .config( [
  	'$stateProvider',
  	'$urlRouterProvider',
  	'$locationProvider',
    '$indexedDBProvider',
    '$mdThemingProvider',
    '$mdIconProvider',
    'LanguagesProvider',
  	function appConfig (
  		$stateProvider,
  		$urlRouterProvider,
  		$locationProvider,
      $indexedDBProvider,
      $mdThemingProvider,
      $mdIconProvider,
      LanguagesProvider
  	) {

  		$urlRouterProvider.otherwise('/');
  		$locationProvider.html5Mode(false);


      $indexedDBProvider
      .connection('Interprest')
      .upgradeDatabase(1, function(event, db, tx){
        var eventStore = db.createObjectStore('event', {keyPath: 'id', autoIncrement: true});
        var postStore = db.createObjectStore('post', {keyPath: 'id', autoIncrement: true});
        postStore.createIndex('event_idx', 'eventId', {unique: false});
        var imageStore = db.createObjectStore('image', {keyPath: 'id', autoIncrement: true});
        var languageStore = db.createObjectStore('language', {keyPath: 'id', autoIncrement: true});
        languageStore.createIndex('code_idx', 'code', {unique: true});

        var langs = LanguagesProvider.getISOLanguages();
        angular.forEach(langs, function(lang, code){
          languageStore.add({
            name:lang.name,
            code:code,
            nativeName: lang.nativeName,
            _lowername: lang.name.toLowerCase(),
            _lowernative: lang.nativeName.toLowerCase(),
          });
        });
      });
      $mdThemingProvider.definePalette('interprest', {
        '50': 'ffebee',
        '100': 'ffcdd2',
        '200': 'ef9a9a',
        '300': 'EEEEEE',
        '400': 'ef5350',
        '500': '46B1DB',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
      });
      $mdThemingProvider.theme('default')
      .primaryPalette('interprest');

      $mdIconProvider
      // .defaultIconSet("/icons/svg/avatars.svg", 128)
      .icon("menu"       , "icons/svg/menu.svg"        , 24)
      .icon("home"       , "icons/svg/home.svg"        , 24)
      .icon("cancel"       , "icons/svg/cancel.svg"    , 24)
      .icon("edit"       , "icons/svg/edit.svg"    , 24)
      .icon("list"       , "icons/svg/list.svg"    , 24)
      .icon("delete"       , "icons/svg/delete.svg"    , 24)
      .icon("add"       , "icons/svg/add.svg"    , 24)
      .icon("gallery"       , "icons/svg/gallery.svg"    , 24)
      .icon("image"       , "icons/svg/image.svg"    , 24)
      .icon("text"       , "icons/svg/text.svg"    , 24)
      .icon("more"       , "icons/svg/more_v.svg"    , 24)
      .icon("export"       , "icons/svg/export.svg"    , 24)
      .icon("done"       , "icons/svg/done.svg"    , 24)
      .icon("event"       , "icons/svg/event.svg"    , 24);
  	}
  ]);


})();
