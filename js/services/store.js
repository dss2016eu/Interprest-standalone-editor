(function(){
  'use strict';

  angular.module('interprestStandalone.services.store', [])
  .service('Store', ['$q', '$indexedDB', function($q, $indexedDB){
    this.get = function(name){
      var defer = $q.defer();
      $indexedDB.openStore(name, function(store){
        defer.resolve(store);
      });

      return defer.promise;
    };
  }]);

})();
