(function(){
  'use strict';

  angular
  .module('interprestStandalone.models.Post', [
  ])
  .factory('Post', ['$q', '$indexedDB', function PostModel($q, $indexedDB){

    var posts = [];
    var postStore;
    var initPromise = $q.defer();

    function getStore(){
      var defer = $q.defer();
      $indexedDB.openStore('post', function(store){
        defer.resolve(store);
      });

      return defer.promise;
    }

    getStore().then(function(store){
      store.getAll().then(function(items) {
        posts = items;
      });
    });

    function Post(args){
      var instance = this;
      instance.title = 'New Post';
      instance.eventId = null;
      angular.extend(instance, args);
    }


    Post.prototype.save = function save(){
      var instance = this;
      var defer = $q.defer();
      delete instance.$$array;
      delete instance.$$hashKey;
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

    Post.prototype.delete = function del(){
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
          Post.List(items).then(function(collection){
            defer.resolve(collection);
          });
        });
      });

      return defer.promise;
    }
    function one(id){
      var defer = $q.defer();
      getStore().then(function(store){
        store.find(parseInt(id)).then(function(item){
          defer.resolve( new Post(item) );
        });
      });

      return defer.promise;
    }

    function byEvent(id){
      var defer = $q.defer();
      getStore().then(function(store){
        var find = store.query();
        find = find.$eq(id);
        find = find.$index("event_idx");
        store.eachWhere(find).then(function(items){
            defer.resolve(new Post.List(items));
        });
      });

      return defer.promise;
    }

    var  wrapAsNewModelInstance = function(rawObj, arrayInst){
       // create an instance
       var inst = rawObj.constructor === Post ? rawObj : new Post(rawObj);
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

      var __oldPush = items.push;
      items.push = function(){
          // Array.push(..) allows to pass in multiple params
          var args = Array.prototype.slice.call(arguments);

          for(var i=0; i<args.length; i++){
              args[i] = wrapAsNewModelInstance(args[i], items);
          }

          __oldPush.apply(items, args);
      };

      return $q.when(items);
    }

    Post.List = Collection;
    Post.all = all;
    Post.one = one;
    Post.byEvent = byEvent;

    return Post;
  }]);
})();
