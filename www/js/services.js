/**
 * App Services submodule
 * 
 * @module app.services
 */

angular.module('app.services', [])

/**
 * @class LocationService
 * @constructor
 * @description It is used for search location while typing from google API
 * @param {module} $q it is used for promise return
 */
.service('LocationService', function($q) {
    /**
     * @attribute autocompleteService
     * @type var
     * @desription it is used to initialize google autocomplete service
     */

    var autocompleteService = new google.maps.places.AutocompleteService();
    /**
     * @attribute detailsService
     * @type var
     * @desription it is used to initialize google place service by passing input element as argument
     */
    var detailsService = new google.maps.places.PlacesService(document.createElement("input"));
    return {

        /**
         * @method searchAddress
         * @description this method search the location while keypress in the input
         * @param string input it is text used for search
         * @return promise it return the places object/array from google API with promise
         */
        searchAddress: function(input) {
            var deferred = $q.defer();

            autocompleteService.getQueryPredictions({
                input: input
            }, function(result, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    deferred.resolve(result);
                } else {
                    deferred.reject(status)
                }
            });

            return deferred.promise;
        },

        /**
         * @method getDetails
         * @description this method is used to get details of place by passing a Place ID as argument
         * @param string placeId placeId
         * @return promise it return the place details with promise
         */
        getDetails: function(placeId) {
            var deferred = $q.defer();
            detailsService.getDetails({ placeId: placeId }, function(result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }
    };
})


/**
 * @class CurrentLocationService
 * @constructor
 * @description It gets the current location of user and formats the location and also save this location in the database
 * @param {module} $cordovaGeolocation gets the current location
 * @param {module} $q it is used for promise return
 * @param {class} Posts it is used for saving the location in the database by calling its method insertCurrentLocation
 * @param {module} localStorageService it is used to store location in the local storage
 */

.service('CurrentLocationService', function($cordovaGeolocation, $q, Posts, localStorageService) {
    this.get = function() {
        var defered = $q.defer();
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {

                console.log("position is", position);
                //24.876852, 67.062625
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                console.log(lat);
                console.log(long);

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(lat, long);
                localStorageService.set('currentLatLng', latlng);
                geocoder.geocode({ 'latLng': latlng }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            //$scope.final_obj.location = results[1];
                            console.log("result is ", results); // details address
                            var loc = {};
                            loc.location_name = results[0].formatted_address;
                            localStorageService.set('currentLocation', results[0].formatted_address);
                            var lat = results[1].geometry.location.lat();
                            var lng = results[1].geometry.location.lng()
                            var arr = [];
                            arr[0] = lng;
                            arr[1] = lat;
                            loc.location = arr;
                            console.log(loc)
                            defered.resolve(true)
                            Posts.insertCurrentLocation(loc, { loc: 'current_location' }).success(function(res) {
                                    console.log(res)

                                })
                                .error(function(err) {
                                    console.log(err)
                                        //defered.reject("Error in inserting location");
                                })
                                //$scope.data.address = results[1].formatted_address;

                            //$scope.locationChanged(results[1].formatted_address)
                        } else {
                            console.log('Location not found');
                            defer.reject("Location not found");
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                        defered.reject('Geocoder failed due to: ' + status);
                    }
                }, function(err) {
                    console.log("in error", err)
                    defered.reject("in error", err);
                });
            }, function(err) {
                // error
                defered.reject("in error", err);
            });

        return defered.promise;
    }
})

/**
 * @class ImageUploadService
 * @constructor
 * @description This service selects the image from the camera/gallery and uploads image to the server and returns the image id in the end
 * @param {module} $cordovaCamera this plugin/module is used for selecting an image from the gallery or camera
 * @param {class} httpService it is used for calling build Url function and get headers 
 * @param {module} $cordovaFileTransfer it is used for transfering image/file to server.
 * @param {module} $q it is used for promise return
 * @param {var} $rootScope it is the rootscope of the app
 */
.service('ImageUploadService', function($cordovaCamera, httpService, $cordovaFileTransfer, $q, $rootScope) {

    /**
     * @attribute $rootScope.loadedValue
     * @type double
     * @desription it stores the progress in percentage while image is being uploaded
     */

    $rootScope.loadedValue = 0.0;
    /**
     * @attribute $rootScope.cancelUpload
     * @type boolean
     * @desription it is used to cancel the upload when image is being uploaded to server
     */
    $rootScope.cancelUpload = false;
    /**
     * @method UploadNow
     * @description this method calls select and upload method to upload image to server
     * @param string type type can be profile image or post image
     * @param boolean isCamera the image which is to be uploaded weather it is taken from camera or selected from gallery
     * @param boolean isEditable the selected image is editable or not
     * @return promise it return the image data with promise after selecting an image and uploading to webserver
     */

    this.UploadNow = function(type, isCamera, isEditable) {
        var deferred = $q.defer();
        select(isCamera, isEditable).then(function(res) {
            //$rootScope.showLoading("Uploading", 100000)
            console.log('selected');
            $rootScope.cancelUpload = false;
            $rootScope.loadedValue = 0;
            upload(res, type).then(function(res) {
                console.log('uploaded');
                //$rootScope.hideLoading()
                deferred.resolve(res);
            }, function(err) {
                deferred.reject(err)
            })
        }, function(err) {
            deferred.reject(err)
        })
        return deferred.promise;
    }


    /**
     * @method select
     * @description this method is used to select image from camera or gallery
     * @param boolean isCamera the image which is to be uploaded weather it is taken from camera or selected from gallery
     * @param boolean isEditable the selected image is editable or not
     * @return promise it return the image data with promise after selecting an image
     */

    this.select = function(isCamera, isEditable) {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: (isCamera == true) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: isEditable || false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        var deferred = $q.defer();
        $cordovaCamera.getPicture(options).then(function(imageData) {
            var imgData = "data:image/jpeg;base64," +imageData;
            deferred.resolve(imgData)
        }, function(err) {
            deferred.reject(err)
        });
        return deferred.promise;
    }

    /**
     * @method select
     * @description this method is used to select image from camera or gallery
     * @param boolean isCamera the image which is to be uploaded weather it is taken from camera or selected from gallery
     * @param boolean isEditable the selected image is editable or not
     * @return promise it return the image data with promise after selecting an image
     */

    function select(isCamera, isEditable) {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: (isCamera == true) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: isEditable || false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        var deferred = $q.defer();
        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log("image url", imageData);
            $rootScope.profileTempImage = imageData;
            deferred.resolve(imageData)
        }, function(err) {
            deferred.reject(err)
        });
        return deferred.promise;
    }

    /**
     * @method upload
     * @description this method uploads the image to server
     * @param string imageUri it is the image data returned from 'select' method
     * @param string type the type of image weather it is of post image or profile image
     * @return promise it return the response from server with promise after uploading an image
     */
    this.upload = function(imageUri, type) {
        var route = httpService.Utils.buildUrl(new Array('upload', 'image'), { imageof: type }),
            filePath = imageUri;
        var options = {
            fileKey: "uploadfile",
            fileName: imageUri.substr(imageUri.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg",
            headers: httpService.Utils.getHeader().headers
        };

        var deferred = $q.defer();
        console.log('uploading');
        $cordovaFileTransfer.upload(route, filePath, options).then(function(result) {
            var res = JSON.parse(result.response)
            deferred.resolve(res);
        }, function(err) {
            console.log("err in uploading",err)
            deferred.reject(err)
        }, function(progress) {
            if (!$rootScope.cancelUpload) {
                $rootScope.loadedValue = ((progress.loaded / progress.total) * 100).toString().split(".")[0];
                console.log($rootScope.loadedValue);
            }

        });
        return deferred.promise;
    }

    /**
     * @method upload
     * @description this method uploads the image to server
     * @param string imageUri it is the image data returned from 'select' method
     * @param string type the type of image weather it is of post image or profile image
     * @return promise it return the response from server with promise after uploading an image
     */

    function upload(imageUri, type) {
        var route = httpService.Utils.buildUrl(new Array('upload', 'image'), { imageof: type }),
            filePath = imageUri;
        var options = {
            fileKey: "uploadfile",
            fileName: imageUri.substr(imageUri.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg",
            headers: httpService.Utils.getHeader().headers
        };

        var deferred = $q.defer();
        console.log('uploading');
        $cordovaFileTransfer.upload(route, filePath, options).then(function(result) {
            var res = JSON.parse(result.response)
            deferred.resolve(res);
        }, function(err) {
            console.log("err in uploading",err)
            deferred.reject(err)
        }, function(progress) {
            if (!$rootScope.cancelUpload) {
                $rootScope.loadedValue = ((progress.loaded / progress.total) * 100).toString().split(".")[0];
                console.log($rootScope.loadedValue);
            }

        });
        return deferred.promise;
    }

})