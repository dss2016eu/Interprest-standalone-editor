(function(){
	'use strict';

	angular.module( 'interprestStandalone.controllers.image', [
	])
  .controller('ImageCtrl', [
		'$log',
		'$timeout',
    '$mdDialog',
		'$mdMedia',
    'FileUploader',
		'$window',
		'Image',
		'images',
    function ImageController(
			$log,
			$timeout,
      $mdDialog,
			$mdMedia,
      FileUploader,
			$window,
			Image,
			images
    ){

      var vm = this;
			vm.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
			vm.images = images;

      vm.cancel = function () {
        $mdDialog.cancel();
      };

      var uploader = vm.uploader = new FileUploader({
        queueLimit: 1
      });

      uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          $log.debug(item);
          var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|'.indexOf(type) !== -1;
        }
      },
			{
				name: 'sizeFilter',
				fn: function(item /*{File|FileLikeObject}*/, options) {
					var size = item.size;
					$log.debug("SIZE:", item.size);
					return size < 200000; // 200KB
				}
			});

			vm.selectImage = function(image){
				vm.selectedImage=null;
				$timeout(function(){
					vm.selectedImage = image;
				},0);
			};

			vm.saveImage = function(){
				vm.newImage.save().then(function(savedImage){
					vm.images.push(savedImage);
					vm.selectedImage = savedImage;
					vm.uploader.clearQueue();
				});
			};

			vm.insertImage = function(){
				$log.debug("inserting...", vm.selectedImage);
				$mdDialog.hide(vm.selectedImage);
			};

			vm.cancelImage = function(){
				delete vm.newImage;
				vm.uploader.clearQueue();
			};

			function isFile(item) {
					return angular.isObject(item) && item instanceof $window.File;
			}

      uploader.onAfterAddingFile = function(fileItem) {
				vm.newImage = new Image({title:fileItem.file.name, type: fileItem.file.type,file: fileItem._file});
      };

			vm.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
				if(filter.name==='sizeFilter'){
					$log.debug("Image is too large");
				} else if(filter.name==='imageFilter'){
					$log.debug("File is not an image");
				}
			};
    }
  ])

  /**
* The ng-thumb directive
* @author: nerv
* @version: 0.1.2, 2014-01-09
*/
  .directive('ngThumb', ['$window', function($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
          return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
          var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas/>',
      link: function(scope, element, attributes) {
        if (!helper.support) return;

        var params = scope.$eval(attributes.ngThumb);

        if (!helper.isFile(params.file)) return;
        if (!helper.isImage(params.file)) return;

        var canvas = element.find('canvas');
        var reader = new FileReader();

        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);

        function onLoadFile(event) {
            var img = new Image();
            img.onload = onLoadImage;
            img.src = event.target.result;
        }

        function onLoadImage() {
            var width = params.width || this.width / this.height * params.height;
            var height = params.height || this.height / this.width * params.width;
            canvas.attr({ width: width, height: height });
						canvas.attr({style:'max-width:100%;'});
            canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
        }
      }
    };
  }]);

})();
