(function(){
  'use strict';

  angular
  .module('interprestStandalone.models.Event', [
  ])
  .factory('Event', [
    '$q',
    '$indexedDB',
    'Post',
    function EventModel(
      $q,
      $indexedDB,
      Post
    ){
      var events = [];
      var eventStore;
      var initPromise = $q.defer();

      function getStore(){
        var defer = $q.defer();
        $indexedDB.openStore('event', function(store){
          defer.resolve(store);
        });

        return defer.promise;
      }

      getStore().then(function(store){
        store.getAll().then(function(items) {
          events = items;
        });
      });

      function Event(args){
        var instance = this;
        instance.title = 'New event';
        instance.languages = [];
        instance.posts = [];
        angular.extend(instance, args);
      }


      Event.prototype.save = function save(){
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

      Event.prototype.delete = function del(){
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
            Event.List(items).then(function(collection){
              defer.resolve(collection);
            });
          });
        });

        return defer.promise;
      }
      function one(id){
        var defer = $q.defer();
        getStore().then(function(store){
          var data = $q.all([
            store.find(parseInt(id)),
            Post.byEvent(parseInt(id))
          ]);

          data.then(function(data){
            data[0].posts = data[1];
            defer.resolve( new Event(data[0]) );
          });
        });

        return defer.promise;
      }

      var  wrapAsNewModelInstance = function(rawObj, arrayInst){
         // create an instance
         var inst = rawObj.constructor === Event ? rawObj : new Event(rawObj);
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

      Event.List = Collection;
      Event.all = all;
      Event.one = one;

      return Event;
    }
  ]);
})();
