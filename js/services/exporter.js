(function(){
  'use strict';

  angular
  .module('interprestStandalone.services.exporter', [
  ])
  .factory('Exporter', [
    'Event',
    'Image',
    '$q',
    '$timeout',
    '$window',
    function Exporter(
      Event,
      Image,
      $q,
      $timeout,
      $window
    ){

      function exportEvent(eventId){

        var db;
        var images = [];

        if(typeof eventId === 'object') {
          eventId = eventId.id;
        }

        Event.one(eventId).then(function(event){
          createDB();
          insertEvent(event);
          insertPosts(event.posts);
          insertImages(images).then(function(){
            $timeout(function(){
              var arraybuff = db.export();
              var blob = new Blob([arraybuff]);
              $window.saveAs(blob, "interprest.sqlite");
              db.close();
            }, 0);
          });

        });


        function createDB(){
          db = new SQL.Database();
				  db.run("CREATE TABLE event (id INTEGER PRIMARY KEY, title TEXT, description TEXT, imageId INTEGER);");
          db.run("CREATE TABLE post (id INTEGER PRIMARY KEY, data TEXT, imageId INTEGER, eventId INTEGER, status INTEGER, createdAt DATETIME, updatedAt DATETIME);");
          db.run("CREATE TABLE image (id INTEGER PRIMARY KEY, title TEXT, type TEXT, file BLOB);");
          db.run("CREATE TABLE language (id INTEGER PRIMARY KEY, name TEXT, nativeName TEXT, code TEXT, eventId INTEGER);");
        }

        function insertEvent(event){
          db.run("INSERT INTO event (id, title, description, imageId) VALUES (?, ?, ?, ?)", [
            1,
            event.title,
            event.description,
            event.image || null
          ]);

          if(event.image && images.indexOf(event.image)===-1) {
            images.push(event.image);
          }

          angular.forEach(event.languages, function(language){
            db.run("INSERT INTO language (id, name, nativeName, code, eventId) VALUES(?, ?, ?, ?, ?)", [
              language.id,
              language.name,
              language.nativeName,
              language.code,
              1
            ]);
          });
        }

        function insertPosts(posts){
          angular.forEach(posts, function(post){
            if(post.image && images.indexOf(post.image)===-1) {
              images.push(post.image);
            }
            db.run("INSERT INTO post (data, imageId, eventId, status) VALUES(?, ?, ?, ?)", [
              JSON.stringify(post.data),
              post.image || null,
              1,
              1
            ]);
          });
        }

        function insertImages(images){
          var allPromises = [];
          angular.forEach(images, function(imageId){
            var thisPromise = $q.defer();
            allPromises.push(thisPromise.promise);
            Image.one(imageId).then(function(image){
              blobUtil.blobToBase64String(image.file)
              .then(function (binaryString) {
                db.run("INSERT INTO image VALUES (?,?,?,?)", [
                  image.id,
                  image.title,
                  image.type,
                  binaryString
                ]);
                thisPromise.resolve();
              });
            });
          });

          return $q.all(allPromises);
        }
      }

      return {
        export: exportEvent
      };
    }]
  );
})();
