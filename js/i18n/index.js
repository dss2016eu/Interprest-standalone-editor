(function(){
  'use strict';

  var supportedLocales = ['en', 'es', 'eu'];

  var strings = {
    'label.home': {
      en: 'Home',
      es: 'Inicio',
      eu: 'Hasiera'
    },
    'label.events': {
      en: 'My Events',
      es: 'Mis Eventos',
      eu: 'Nire Ekitaldiak'
    },
    'label.new': {
      en: 'New',
      es: 'Nuevo',
      eu: 'Berria'
    },
    'label.edit': {
      en: 'Edit',
      es: 'Editar',
      eu: 'Editatu'
    },
    'label.delete': {
      en: 'Delete',
      es: 'Eliminar',
      eu: 'Ezabatu'
    },
    'label.export': {
      en: 'Export',
      es: 'Exportar',
      eu: 'Esportatu'
    },
    'label.save': {
      en: 'Save',
      es: 'Guardar',
      eu: 'Gorde'
    },
    'label.cancel': {
      en: 'Cancel',
      es: 'Cancelar',
      eu: 'Ezeztatu'
    },
    'label.list': {
      en: 'Messages list',
      es: 'Lista de mensajes',
      eu: 'Mezu zerrenda'
    },
    'label.images': {
      en: 'Images',
      es: 'Imágenes',
      eu: 'Irudiak'
    },
    'label.upload': {
      en: 'Upload',
      es: 'Subir',
      eu: 'Igo'
    },
    'label.gallery': {
      en: 'Gallery',
      es: 'Galería',
      eu: 'Galeria'
    },
    'label.addToPost': {
      en: 'Add to message',
      es: 'Añadir al mensaje',
      eu: 'Mezuari gehitu'
    },
    'label.selectImage': {
      en: 'Select image',
      es: 'Seleccione imagen',
      eu: 'Irudia aukeratu'
    },
    'label.searchLanguage': {
      en: 'Search languages',
      es: 'Buscar idiomas',
      eu: 'Hizkuntzak bilatu'
    },
    'label.menu': {
      en: 'Menu',
      es: 'Menú',
      eu: 'Menua'
    },
    'msg.export': {
      en: '',
      es: '',
      eu: ''
    },
    'form.title': {
      en: 'Title',
      es: 'Título',
      eu: 'Titulua'
    },
    'form.description':{
      en: 'Description',
      es: 'Descripción',
      eu: 'Azalpena'
    },
    'interprest.motto':{
      en: 'Open source and portable simultaneous interpretation system',
      es: 'Sistema de interpretación simultánea, portátil y de código abierto',
      eu: 'Aldibereko interpretazio sistema eramangarri eta librea'
    },
    'interprest.description':{
      en: '<a href="http://interprest.io">Interprest</a> is an open source and portable simultaneous interpretation system. By combining smartphones and wireless technologies interpreters can stream audio channels using a small microphone while listeners receive them using their own smartphone. The project is a bet in favor of open technologies, and so, opens its development to the community.',
      es: '<a href="http://interprest.io">Interprest</a> es un sistema de interpretación simultánea, portátil y de código abierto. Se vale de la tecnología inalámbrica empleando un sistema de comunicación basado en móviles. De esta forma, el móvil del intérprete (emisor) envía la señal a través de un pequeño micrófono y el oyente (receptor) lo recibe en su móvil. El proyecto es una apuesta a favor de la tecnología libre, y pone a disposición de la comunidad todo su desarrollo.',
      eu: '<a href="http://interprest.io">Interprest</a>, aldibereko interpretazio sistema eramangarri eta librea da. Haririk gabeko teknologia baliatuz, mugikorretan oinarritutako komunikazio-sistema erabiltzen duena. Interprete edo igorlearen mugikorrak mikrofono txiki baten bidez bidaltzen du seinalea eta entzuleak edo hartzaileak mugikorrean jasotzen du. Proiektuak teknologia irekien aldeko apustu garbia egiten du hasieratik, komunitatearen esku jarriz garapen guztia.'
    },
  };
  angular.module('interprestStandalone.i18n', [])
  .filter('i18n', ['Config', '$rootScope', function(Config, $rootScope) {
    return function(input) {
      return strings[input][Config.getLang()];
    };
  }])
  .service('i18n', [function(){
    this.isLocaleSupported = function(locale){
      return supportedLocales.indexOf(locale)!==-1;
    };
  }]);
})();
