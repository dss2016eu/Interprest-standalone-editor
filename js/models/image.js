(function(){
  'use strict';

  angular
  .module('interprestStandalone.models.Image', [
  ])
  .factory('Image', [
    '$q',
    '$indexedDB',
    function ImageModel(
      $q,
      $indexedDB
    ){
      var images = [];
      var imageStore;

      function getStore(){
        var defer = $q.defer();
        $indexedDB.openStore('image', function(store){
          defer.resolve(store);
        });

        return defer.promise;
      }

      getStore().then(function(store){
        store.getAll().then(function(items) {
          images = items;
        });
      });

      function Image(args){
        var instance = this;
        instance.title = 'New image';
        angular.extend(instance, args);
      }


      Image.prototype.save = function save(){
        var instance = this;
        var defer = $q.defer();
        getStore().then(function(store){
          store.upsert(instance).then(function(e){
            if(!instance.id) {
              // add id to current instance
              instance.id = e[0];
            }
            defer.resolve(instance);
          });
        });

        return defer.promise;
      };

      Image.prototype.delete = function del(){
        var instance = this;
        var defer = $q.defer();
        getStore().then(function(store){
          store.delete(instance.id).then(function(){
            if(instance.$$array){
              var arr = instance.$$array;
              if(arr){
                  arr.splice(arr.indexOf(instance), 1);
              }
            }
            defer.resolve();
          });
        });

        return defer.promise;
      };

      function all() {
        var defer = $q.defer();
        getStore().then(function(store){
          store.getAll().then(function(items) {
            Image.List(items).then(function(collection){
              defer.resolve(collection);
            });
          });
        });

        return defer.promise;
      }
      function one(id){
        var defer = $q.defer();
        getStore().then(function(store){
          store
          .find(parseInt(id))
          .then(function(data){
            defer.resolve( new Image(data) );
          });
        });

        return defer.promise;
      }

      var  wrapAsNewModelInstance = function(rawObj, arrayInst){
         // create an instance
         var inst = rawObj.constructor === Image ? rawObj : new Image(rawObj);
         // set a pointer to the array
         inst.$$array = arrayInst;

         return inst;
      };

      function Collection(items){
        items = items || [];
        items.forEach(function(item, i){
          if(item === null || item === undefined) return;
          items[i] = wrapAsNewModelInstance(item, items);
        });

        return $q.when(items);
      }

      Image.List = Collection;
      Image.all = all;
      Image.one = one;

      return Image;
    }
  ]);
})();
