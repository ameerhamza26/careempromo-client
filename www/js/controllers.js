angular.module('app.controllers', [])


.controller('MainScreenController', function($scope, $state) {
    $scope.navigate = function(id) {
        $state.go('register', { id: id });
    }
})

.controller('LoginCtrl', function($scope, User, $ionicPopup, localStorageService, $rootScope,$state) {
        $scope.user = {};
        $scope.submit = function() {
            User.login($scope.user).success(function(res) {
                    if (res.meta.status == 200) {
                        localStorageService.set("auth_token", res.data.auth.token);
                        localStorageService.set("loggedInUser", res.data.auth.user);
                        localStorageService.set("loggedInUserUid", res.data.auth.user._id);
                        $rootScope.user = localStorageService.get("loggedInUser");
                        $scope.user = {};
                        if ($rootScope.user.brand) {
                            $state.go('brandposts');
                        } else {
                            if ($rootScope.user.on_boarding == 0) {

                                $state.go('categories');
                            } else {

                                $state.go('dashboard');
                            }
                        }

                        $scope.isButtonLoading = false
                    }

                })
                .error(function(err) {
                    var errors = [];
                    errors.push('Invalid Username/Password! ')
                    $scope.openErrorModal(errors);
                    $scope.isButtonLoading = false;
                })
        }


        $scope.openErrorModal = function(err) {
            $scope.posterrors = err;
            var alertPopup = $ionicPopup.alert({
                title: 'Something isn\'t right!',
                template: '<div style="background-color: white; padding: 20px; margin-top: 10px;padding-bottom: 30px;">' +
                    '<div style="width: 15px; height: 15px; color:black;" ng-repeat="x in posterrors">' +
                    '<img src="img/cross.png" style="width: 100%; height: 100%;">' +
                    '<span style="position: absolute;margin-left: 5px;font-size: 14px; font-family: ProximaNovaRegular;">{{x}}</span>' +
                    '</div>' +
                    '</div>',
                scope: $scope,
                okText: 'Try again!'
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        }
    })
    .controller('RegisterCtrl', function($scope, $ionicPopup, $stateParams, $rootScope, User, localStorageService, $state) {
        $scope.stateid = $stateParams.id;
        if ($stateParams.id == 0) {
            $scope.placeholder = "Enter brand name";
        } else {
            $scope.placeholder = "Enter name";
        }

        $scope.user = {};

        $scope.submit = function() {
            var errors = [];
            var email_regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
            console.log("email is ", $scope.user.email);

            if ($rootScope._.isEmpty($scope.user.name)) {
                errors.push('name field is required')
            }
            if ($rootScope._.isEmpty($scope.user.email)) {
                errors.push('email field is required')
            } else {
                if (!email_regex.test($scope.user.email)) {
                    errors.push('Not a valid Email!')
                }
            }
            if ($rootScope._.isEmpty($scope.user.password)) {
                errors.push('password field is required')
            }

            if (errors.length != 0) {
                $scope.errors = errors;
                $scope.openErrorModal($scope.errors);
            } else {
                $scope.isButtonLoading = true;
                $scope.user.brand = $stateParams.id == 0 ? true : false;
                $scope.user.customer = $stateParams.id == 1 ? true : false;
                User.register($scope.user).success(function(result) {
                        var params = {
                            email: $scope.user.email,
                            password: $scope.user.password
                        };

                        User.login(params).success(function(res) {
                                if (res.meta.status == 200) {
                                    localStorageService.set("auth_token", res.data.auth.token);
                                    localStorageService.set("loggedInUser", res.data.auth.user);
                                    localStorageService.set("loggedInUserUid", res.data.auth.user._id);
                                    $rootScope.user = localStorageService.get("loggedInUser");
                                    $scope.user = {};
                                    if ($stateParams.id == 0) {
                                        $state.go('brandposts');
                                    } else {
                                        $state.go('categories');
                                    }

                                    $scope.isButtonLoading = false
                                }

                            })
                            .error(function(err) {
                                $scope.isButtonLoading = false
                            })
                    })
                    .error(function(err) {

                        if (err.errors) {
                            if (err.errors[0].code == 1002) {
                                errors.push('Password must be 6 characters long!')
                            }
                        } else { //custom response
                            errors.push('Email is already taken!')
                        }
                        $scope.isButtonLoading = false;
                        $scope.errors = errors;
                        $scope.openErrorModal($scope.errors);
                    })
            }
        }

        $scope.openErrorModal = function(err) {
            $scope.posterrors = err;
            var alertPopup = $ionicPopup.alert({
                title: 'Something isn\'t right!',
                template: '<div style="background-color: white; padding: 20px; margin-top: 10px;padding-bottom: 30px;">' +
                    '<div style="width: 15px; height: 15px; color:black;" ng-repeat="x in posterrors">' +
                    '<img src="img/cross.png" style="width: 100%; height: 100%;">' +
                    '<span style="position: absolute;margin-left: 5px;font-size: 14px; font-family: ProximaNovaRegular;">{{x}}</span>' +
                    '</div>' +
                    '</div>',
                scope: $scope,
                okText: 'Try again!'
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        }
    })

.controller('CategoriesCtrl', function($scope, Posts, User, localStorageService, $state) {
    $scope.categories = [];
    Posts.getCategories().success(function(res) {
            for (var i = 0; i < res.data.length; i++) {
                var data = res.data[i];
                data.checked = false;
                $scope.categories.push(data)
            }
        })
        .error(function(err) {

        })

    $scope.check = function(i) {
        if ($scope.categories[i].checked) {
            $scope.categories[i].checked = false;
        } else {
            $scope.categories[i].checked = true;
        }
    }

    $scope.submit = function() {
        var final_obj = {};
        final_obj.category = [];
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].checked) {
                final_obj.category.push($scope.categories[i].category_name)
            }
        }

        $scope.isLoading = true;
        User.update_categories(final_obj).success(function(res) {
                localStorageService.set('loggedInUser', res.data);
                $state.go('selectdestination');
                $scope.isLoading = false;
            })
            .error(function(err) {
                $scope.isLoading = false;
            })
    }
})

.controller('SelectDestinationCtrl', function($scope, $state, $timeout, LocationService, CurrentLocationService, $ionicLoading, localStorageService, Posts) {
    $scope.user = {};

    $scope.searchHome = {};

    $scope.change = function(x) {
        try {
            LocationService.searchAddress(x).then(function(result) {
                $scope.searchHome.error = null;
                $scope.searchHome.suggestions = result;
            }, function(status) {
                $scope.searchHome.error = "There was an error :( " + status;
            });
        } catch (err) {
            $scope.searchHome.suggestions = [];
        }
    }

    $scope.searchDestination = {};
    $scope.changeDestination = function(x) {
        try {
            LocationService.searchAddress(x).then(function(result) {
                $scope.searchDestination.error = null;
                $scope.searchDestination.suggestions = result;
            }, function(status) {
                $scope.searchDestination.error = "There was an error :( " + status;
            });
        } catch (err) {
            $scope.searchDestination.suggestions = [];
        }
    }
    var homearr = [];
    var destarr = [];
    $scope.choosePlace = function(place, isHomeLocation) {
        LocationService.getDetails(place.place_id).then(function(location) {
            console.log(location);
            if (isHomeLocation == 1) {
                $scope.user.locationtext = place.description || location.formatted_address;
                var loc = {};
                loc.location_name = place.description || location.formatted_address;
                localStorageService.set('currentLocation', loc.location_name);
                var lat = location.geometry.location.lat();
                var lng = location.geometry.location.lng();

                homearr[0] = lng;
                homearr[1] = lat;
                localStorageService.set('currentLatLng', homearr);
                loc.location = homearr;
                Posts.insertCurrentLocation(loc, { loc: 'current_location' }).success(function(res) {
                        $scope.searchHome.suggestions = [];
                    })
                    .error(function(err) {
                        $scope.searchHome.suggestions = [];
                    })
            } else {
                $scope.user.destinationtext = place.description || location.formatted_address;
                var lat = location.geometry.location.lat();
                var lng = location.geometry.location.lng();

                destarr[0] = lng;
                destarr[1] = lat;
                localStorageService.set('destLatLng', destarr);
                $timeout(function() {
                    $scope.searchDestination.suggestions = [];
                }, 500)
            }


        });
    };


    $scope.turnOn = function() {
        $scope.isLoading = true;
        CurrentLocationService.get().then(function(res) {
            console.log("in turn on then", res)

            if (res == true) {
                //$state.go('sidemenu.dashboard');
                $scope.isLoading = false;
            } else {
                $scope.isLoading = false;
            }
        }, function(err) {
            $scope.isLoading = false;

        })

    }

    $scope.turnOn();

    $scope.letsGo = function() {
        try {

            var MidArr = middlePoint(homearr[1], homearr[0], destarr[1], destarr[0])
            console.log("mid arr", MidArr);
            localStorageService.set('MidLatLng', MidArr);
            var markerPos = new google.maps.LatLng(destarr[1], destarr[0]);
            var currentLatLng = new google.maps.LatLng(homearr[1], homearr[0])
            var distance = google.maps.geometry.spherical.computeDistanceBetween(markerPos, currentLatLng) * 0.000621371;
            localStorageService.set("radius", distance.toFixed(5))
            $state.go('dashboard');
        } catch (err) {
            localStorageService.set("radius", 6);
            $state.go('dashboard');
        }
    }
})

.controller('DashboardCtrl', function($scope, appModalService, localStorageService, $rootScope, Posts, $state) {

    /**
     * @attribute $scope.feeds
     * @type {array} 
     */
    $scope.feeds = []
        /**
         * @attribute offset
         * @type {int} 
         */
    var offset = 0;
    /**
     * @attribute limit
     * @type {int} 
     */
    var limit = 5;
    /**
     * @attribute $scope.noMoreFeedContent
     * @type {boolean} 
     */
    $scope.noMoreFeedContent = false;
    /**
     * @method $scope.getDashboardFeed
     * @description This function is used to fetch dashboard feed based of filter selected by user with offset and limit. 
     */
    $scope.getDashboardFeed = function(start) {
        var _start = start || false;
        var params = {}
        params.offset = offset;
        params.limit = limit;
        params.loc = "current_location"
        params.r = localStorageService.get('radius');
        params.cat = "MY-CATEGORY";

        $rootScope.isSharingLoading = true;
        Posts.getAllFeeds(params).success(function(res) {

                if (_start) {
                    $scope.feeds = [];
                }
                if (res.data.length < limit) {
                    $scope.noMoreFeedContent = true;
                } else {
                    $scope.noMoreFeedContent = false;
                }
                //console.log(res.data)
                //console.log(res.data[0].feed.location[0], res.data[0].feed.location[1], res.data[0].location.location[0], res.data[0].location.location[1])

                for (var i = 0; i < res.data.length; i++) {
                    var markerPos = new google.maps.LatLng(res.data[i].feed.location[1], res.data[i].feed.location[0]);

                    console.log(localStorageService.get('MidLatLng'))
                    try {
                        var currentLatLng = new google.maps.LatLng((localStorageService.get('MidLatLng')[1]), parseInt(localStorageService.get('MidLatLng')[0]))
                            //localStorageService.set("latLonCurrentFeed", res.data[i].location)
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(markerPos, currentLatLng) * 0.000621371;
                        res.data[i].distance = distance.toFixed(2);

                    } catch (err) {

                        //var distance = $rootScope.calulateDistance(res.data[i].feed.location[0], res.data[i].feed.location[1], res.data[i].location.location[0], res.data[i].location.location[1], "K")
                    }

                    //res.data[i].feed.price = res.data[i].feed.price.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
                    res.data[i].feed.price = res.data[i].feed.price.toFixed(2);
                    $scope.feeds.push(res.data[i]);

                }
                console.log("all feeds", $scope.feeds)

                if ($scope.feeds.length == 0) {
                    console.log("in if empty")
                    $scope.showemptydata = true;
                } else {
                    $scope.showemptydata = false;
                }
                $rootScope.isSharingLoading = false;
                offset = offset + limit;
                if (_start) {
                    $scope.$broadcast('scroll.refreshComplete');
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            })
            .error(function(err) {
                $rootScope.isSharingLoading = false;
            })
    };


    /**
     * @method $scope.doRefresh
     * @description This function is used to fetch dashboard from offset = 0 based of filter selected.
     */
    $scope.doRefresh = function() {
        console.log("in do refresh")
        offset = 0;
        $scope.getDashboardFeed(true);
        $scope.noMoreFeedContent = true


    }
    $scope.doRefresh();

    $scope.navigateToMap = function() {
        $state.go('feedlocation');
    }
})

.controller('BrandpostsCtrl', function($scope, appModalService, User, localStorageService) {

    $scope.user = localStorageService.get('loggedInUser');
    $scope.uid = localStorageService.get("loggedInUserUid");
    $scope.activities = [];
    //5905281fcefd80982b4edc6a
    User.getUserPost($scope.uid).success(function(res) {
            console.log(res)
            $scope.posts = res.data;
            for (var i = 0; i < res.data.length; i++) {
                res.data[i].data.price = res.data[i].data.price.toFixed(2);
                $scope.activities.push({ feed: res.data[i].data, user: $scope.user });
            }
            $scope.isLoading = false;
        })
        .error(function(err) {
            console.log(err)
        })

    /**
     * @method $scope.openUserModal
     * @description this method is used to createpost modal with different scope defined in CreatePost Controller
     */
    $scope.openCreatePostModal = function() {
        appModalService.show('templates/createpostmodal.html', 'CreatePostCtrl as vm', {}).then(function(res) {

        })
    }
})

.controller('CreatePostCtrl', function($scope, $http, $timeout, ImageUploadService, $interval, $ionicLoading, $cordovaGeolocation, localStorageService, appModalService, Posts, $rootScope, $ionicHistory, $state, $ionicPopup, $ionicPlatform) {

    function addZeroes(num) {
        var value = Number(num);
        var res = num.split(".");
        if (num.indexOf('.') === -1) {
            value = value.toFixed(2);
            num = value.toString();
        } else {
            value = value.toFixed(2);
            num = value.toString();
        }
        return num
    }

    $scope.final_obj = {};
    $scope.final_obj.price = "Add price"
    $scope.isloading = true;

    $scope.cancel = function() {
        console.log("in cancel")
        $rootScope.loadedValue = 0;
        $rootScope.cancelUpload = true;
        $scope.closeModal(null);
    };


    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
        $rootScope.loadedValue = 0;
        $rootScope.cancelUpload = true;
        console.log("modal is hidden")
    });

    $scope.isHashTagAdded = false;

    function upload() {
        ImageUploadService.UploadNow('post', true, false).then(function(res) {
            $rootScope.profileTempImage = null;
            $scope.imageData = res.data.file[0].medium;
            $scope.isloading = false;
            $scope.final_obj.post_image_id = res.data.fileId;

        }, function(err) {
            console.log("err", JSON.stringify(err));
        })
    }

    $scope.final_obj.location_name = "";

    $scope.uploadpostimage = function() {
        $timeout(function() {
            console.log("in timeout")
        }, 180000)
        upload();
    }

    upload();

    $scope.selectCategory = {}
    $scope.selectCategory.category_name = ["Fruits"];

    $scope.final_obj.category = ["Select Category"];
    $scope.final_obj.remark = "";
    $scope.categoryStyle = {
        "display": "inline-block",
        "color": "grey",
        "font-weight": "normal"
    }

    $scope.selectCategory = function() {
        appModalService.show('templates/partials/category.html', 'SelectCategoryCtrl as vm', { categorySelected: $scope.final_obj.category }).then(function(res) {
            console.log(res)
            if (res != null) {
                if (res.length == 0) {
                    $scope.final_obj.category = ["Select Category"];
                    $scope.categoryStyle = {
                        "display": "inline-block",
                        "color": "grey",
                        "font-weight": "normal"
                    }
                } else {
                    $scope.selectedCategory = res
                    $scope.final_obj.category = res;
                    $scope.selectCategory.category_name = res;
                    $scope.categoryStyle = {
                        "display": "inline-block"
                    }
                }
            }
        })
    }

    $rootScope.$on('CloseCreatePostModal', function(event, args) {
            $scope.cancel();
        })
        //CheckIfLocationOn();

    $scope.selectLocation = function() {
        appModalService.show('templates/partials/locationmodal.html', 'NearLocationCtrl as vm', {}).then(function(res) {
            console.log(res)
            if (res != null) {
                //CreateGoalDataService.setTags(res.hashtags);
            }
        })
    }

    $scope.isFocus = true;
    $scope.openPriceModal = function() {
        console.log("hello")
        appModalService.show('templates/partials/pricemodal.html', 'PriceModalCtrl as vm', { price: $scope.final_obj }).then(function(res) {
            console.log(JSON.stringify(res))
            if (res != null) {
                $scope.final_obj.price = addZeroes(res.price);
            }
        })
    }

    function getLocationObject(place, name) {
        $scope.location = place;
        var lat = $scope.location.geometry.location.lat();
        var lng = $scope.location.geometry.location.lng()
        var arr = [];
        arr[0] = lng;
        arr[1] = lat;
        $scope.final_obj.location = arr;
        $scope.final_obj.location_name = name;
        $scope.final_obj.place = $scope.location.name;
    }

    $rootScope.$on('POSTLOCATION_CHANGED', function(event, args) {
        getLocationObject(args.place, args.place_name);
    })


    ///////////////////////////////////////////////////adding location end////////////////////////////////////////////////////////////////////////////////////
    $scope.isPosting = true;
    var err = ['cat', 'loc'];
    $scope.$watch('final_obj.category', function(newvalue, oldvalue) {
        if (newvalue[0] != "Select Category") {
            err.splice(0, 1);
            if (err.length == 0) {
                $scope.isPosting = false;
            }
        }
    })

    $scope.$watch('final_obj.location_name', function(newvalue, oldvalue) {
        if (newvalue != "") {
            err.splice(0, 1);
            if (err.length == 0) {
                $scope.isPosting = false;
            }
        }
    })

    $scope.creatPost = function() {
        console.log($scope.final_obj.price)
        var errors = [];
        if ($rootScope.loadedValue < 99) {
            if ($rootScope.loadedValue == 0) {
                errors.push('Please Upload Image!')
            } else {
                errors.push('Please wait while your Image is being loaded!')
            }
        }

        if (errors.length != 0) {
            $scope.posterrors = errors;
            var alertPopup = $ionicPopup.alert({
                title: 'Something isn\'t right!',
                template: '<div style="background-color: white; padding: 20px; margin-top: 10px;padding-bottom: 30px;">' +
                    '<div style="width: 15px; height: 15px; color:black;" ng-repeat="x in posterrors">' +
                    '<img src="img/fm/cross.png" style="width: 100%; height: 100%;">' +
                    '<span style="position: absolute;margin-left: 5px;font-size: 14px; font-family: ProximaNovaRegular;">{{x}}</span>' +
                    '</div>' +
                    '</div>',
                scope: $scope,
                okText: 'Try again!'
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        } else {
            $scope.isPosting = true;
            Posts.create($scope.final_obj).success(function(result) {
                    $rootScope.loadedValue = 0.0;
                    $scope.closeModal(null);
                    $rootScope.$broadcast('POST_CREATED', { post: result.data });

                })
                .error(function(err) {
                    console.log(err);
                    //  $scope.isPosting = false;
                    $scope.closeModal(null);
                })
        }
    }

})

.controller('NearLocationCtrl', function($scope, $http, $cordovaGeolocation, $rootScope, LocationService) {
    $scope.nearyByPlaces = [];
    $scope.search = {};
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=YOUR_API_KEY

    $scope.isLoading = true;
    var getCurrentLocation = function() {
            console.log("in get current location")
            var options = { timeout: 10000, enableHighAccuracy: true };
            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

                var latLng = position.coords.latitude + "," + position.coords.longitude;
                $http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latLng + '&radius=500&type=food&key=AIzaSyCyWjvylezBmwr7XhXjQUyAwuC8wq1tf_g', {}).success(function(res) {
                    console.log("near by", res)
                    $scope.nearyByPlaces = res.results;
                    $scope.isLoading = false;
                })

            }, function(error) {
                $scope.isLoading = false;
            });
        }
        //getCurrentLocation();

    function CheckIfLocationOn() {
        console.log("in check if");
        try {
            cordova.plugins.diagnostic.isLocationEnabled(function(res) {
                console.log(res)
                if (!res) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Your device GPS is off. Do you want turn on your GPS settings?'
                    });

                    confirmPopup.then(function(res) {
                        if (res) {
                            checkCurrentState = false;
                            startInterval();
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        } else {
                            console.log('You are not sure');
                        }
                    });
                } else {
                    getCurrentLocation();
                }
            }, function(err) {

            });
        } catch (err) {

        }
    }

    CheckIfLocationOn();
    $scope.choosePlace = function(place) {
        console.log(place);
        LocationService.getDetails(place.place_id).then(function(location) {
            console.log(location);
            $rootScope.$broadcast('POSTLOCATION_CHANGED', { place: location, place_name: place.name });
            $scope.closeModal(null);
        });
    };

    $scope.choosePlaceSearch = function(place) {
        console.log(place);
        LocationService.getDetails(place.place_id).then(function(location) {
            console.log(location);
            $rootScope.$broadcast('POSTLOCATION_CHANGED', { place: location, place_name: place.description });
            $scope.closeModal(null);
        });
    };

    $scope.change = function(x) {
        LocationService.searchAddress(x).then(function(result) {
            $scope.search.error = null;
            $scope.search.suggestions = result;
        }, function(status) {
            $scope.search.error = "There was an error :( " + status;
        });
    }

    $scope.close = function() {
        $scope.closeModal(null);
    }

})

.controller('SelectCategoryCtrl', function($scope, Posts, parameters) {
    var vm = this;

    $scope.isLoading = true;

    Posts.getCategories().success(function(res) {
            console.log(res);
            if (parameters.categorySelected[0] != "Select Category") {
                for (var k = 0; k < parameters.categorySelected.length; k++) {
                    for (var l = 0; l < res.data.length; l++) {
                        if (parameters.categorySelected[k] == res.data[l].category_name) {
                            res.data[l].check = true;
                        }
                    }
                }
            }
            $scope.categories = res.data
            $scope.isLoading = false;
        })
        .error(function(err) {
            console.log(err)
        })

    vm.confirm = function() {
        var category = [];
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].check) {
                category.push($scope.categories[i].category_name)
            }
        }
        $scope.closeModal(category);
    };

    vm.selectedItem = function(category) {
        vm.category = category
    };

    vm.cancel = function() {
        $scope.closeModal(null);
    };
})

.controller('PriceModalCtrl', function($scope, $ionicPopup, parameters, $rootScope) {
    console.log("in price modal")
    var vm = this;
    $scope.obj = parameters.price;
    $scope.cancel = function() {
        $scope.closeModal(null);
    };
    var price_regex = /^[+-]?(\d*|\d{1,3}(,\d{3})*)(\.\d+)?\b$/;
    var errors = []
    $scope.confirm = function() {
        $scope.closeModal({ price: $rootScope._.toString($scope.obj.price) });
    };
})


.controller('FeedLocationCtrl', function($scope, LocationService, localStorageService, $http, $rootScope, $timeout, $cordovaGeolocation, $ionicSideMenuDelegate, Posts) {
    // $ionicSideMenuDelegate.toggleLeft();
    var records = [];
    $scope.isButtonLoading = false;
    //res.data[i].location.location[0]
    //console.log(localStorageService.get("loggedInUser"));
    var radius = localStorageService.get("radius") == null ? 6 : localStorageService.get("radius");
    console.log(radius);
    if (radius <= 5) {
        zoom = 13;
    } else {
        zoom = 11
    }
    zoom = 11;
    $scope.locationfiltervalue = "current_location"
    $scope.filterlocation = "orange";
    $scope.filterprice = "white";
    var icon = 'img/marker.png';

    function initMap(searchObject) {
        console.log("init map", records[0])
        var options = { timeout: 10000, enableHighAccuracy: true };
        console.log(JSON.stringify(localStorageService.get('currentLatLng')))

        if (typeof records[0] != "undefined") {
            try {
                latLng = new google.maps.LatLng(records[0].location.location[1],
                    records[0].location.location[0]);
            } catch (er) {
                latLng = new google.maps.LatLng(localStorageService.get('radius')[1],
                    localStorageService.get('radius')[0]);

            }


        }

        if (typeof localStorageService.get('destLatLng') != "undefined") {
            destLatLng = new google.maps.LatLng(localStorageService.get('destLatLng')[1],
                localStorageService.get('destLatLng')[0]);
        }
        try {
            $scope.latLng = latLng;

            console.log("lat lng is", records[0])
            var mapOptions = {
                center: latLng,
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                disableDefaultUI: true,
                zoomControl: true,
                //styles: [{ "featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{ "color": "#f7f1df" }] }, { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#d0e3b4" }] }, { "featureType": "landscape.natural.terrain", "elementType": "geometry", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.medical", "elementType": "geometry", "stylers": [{ "color": "#fbd3da" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#bde6ab" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffe15f" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#efd151" }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "black" }] }, { "featureType": "transit.station.airport", "elementType": "geometry.fill", "stylers": [{ "color": "#cfb2db" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#a2daf2" }] }]
            };

            // Add the markerto the map
            console.log("in ma[[[")
            map = new google.maps.Map(document.getElementById("map"), mapOptions);
            console.log("map objectss", map)

            // var myCity = new google.maps.Circle({
            //     center: latLng,
            //     radius: (4 *1609.34),
            //     strokeColor: "#0000FF",
            //     strokeOpacity: 0.8,
            //     strokeWeight: 2,
            //     //  fillColor: "#0000FF",
            //     fillOpacity: 0.05
            // });

            map.setTilt(45);
            // console.log("icicler", iCircle)
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: latLng,
                icon: 'img/map-icon.png',
            });

            destLatLng

            var marker2 = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: destLatLng,
                icon: 'img/map-icon.png',
            });

            marker2.addListener('click', function() {
                infoWindow1.setContent("Destination point");
                infoWindow1.open(map, this);
            });
            console.log("icicleraa1", map)
            marker.setDraggable(false)
            console.log("icicleraa2", map)
            var infoWindow1 = new google.maps.InfoWindow({
                content: $scope.locationfiltervalue
            });
            console.log("icicleraa", map)

            marker.addListener('click', function() {
                infoWindow1.setContent("Starting point");
                infoWindow1.open(map, this);
            });
            console.log("icicleraa", map)
            $scope.isButtonLoading = false;
            console.log("icicleraa", map)
            iCircle = new InvertedCircle({
                center: latLng,
                map: map,
                radius: (radius * 1609.34), // 5 km
                editable: true,
                stroke_weight: 0,
                always_fit_to_map: false,
                resize_updown: 'img/resize_updown.png',
                resize_leftright: 'img/resize_leftright.png'
            });
        } catch (err) {
            $scope.isButtonLoading = false;
            console.log("err is", err)
        }




        //Wait until the map is loaded
        google.maps.event.addListenerOnce(map, 'idle', function() {
            loadMarkers();
            console.log("icicleraa", map)
                // enableMap();
        });

    }

    $scope.getDashboardFeed = function(rad) {
        console.log("in map dashboard feed")
        var params = {}
        params.loc = $scope.locationfiltervalue
        params.r = radius || 20;
        records = [];
        console.log("params", params)
        $scope.isButtonLoading = true;
        Posts.getAllFeeds(params).success(function(res) {
                console.log(res.data.length)

                for (var i = 0; i < res.data.length; i++) {
                    var markerPos = new google.maps.LatLng(res.data[i].feed.location[1], res.data[i].feed.location[0]);
                    try {
                        var currentLatLng = new google.maps.LatLng(res.data[i].location.location[1], res.data[i].location.location[0])
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(markerPos, currentLatLng) / 1000;
                        res.data[i].distance = distance.toFixed(2);
                    } catch (err) {

                    }
                    records.push(res.data[i]);


                }

                initMap();
                //console.log(records)
            })
            .error(function(err) {

            })
    };

    $timeout(function() {
        $scope.getDashboardFeed();
    }, 500)



    function loadMarkers() {

        var infoWindow = new google.maps.InfoWindow({
            content: ""
        });
        var allmarkers = [];

        var markers = [];

        for (var k = 0; k < records.length; k++) {
            var record = records[k];
            var lat = record.feed.location[1].toFixed(4);
            var lng = record.feed.location[0].toFixed(4);
            if (k == 0) {
                allmarkers.push({ record: [record], count: 1, feedIndex: [{ index: k }], latlng: [lng, lat] });

            } else {
                var inForIf = false;
                for (var l = 0; l < allmarkers.length; l++) {
                    if (allmarkers[l].latlng[0] == lng && allmarkers[l].latlng[1] == lat) {
                        allmarkers[l].count++;
                        // allmarkers[l]['record'+(allmarkers[l].count)] = record;
                        allmarkers[l].record.push(record);
                        allmarkers[l].feedIndex.push({ index: k });
                        inForIf = true;
                    }
                }

                if (!inForIf) {
                    allmarkers.push({ record: [record], count: 1, feedIndex: [{ index: k }], latlng: [lng, lat] });
                }
            }
        }


        console.log("All markers is", allmarkers)
        for (var j = 0; j < allmarkers.length; j++) {
            var markerPos = new google.maps.LatLng(allmarkers[j].latlng[1], allmarkers[j].latlng[0]);


            // Add the markerto the map
            var marker = new MarkerWithLabel({
                position: markerPos,
                draggable: false,
                raiseOnDrag: true,
                map: map,
                // labelContent: "<div class='inner'>" + allmarkers[j].count + "</div>",
                labelAnchor: new google.maps.Point(0, 0),
                labelClass: "labels", // the CSS class for the label
                isClicked: false,
                icon: 'img/marker.png',
            });
            markers.push(marker);
            var infoWindowContent = "<h4></h4>";
            addInfoWindow(marker, infoWindowContent, record, infoWindow, map, allmarkers[j].count, allmarkers[j].feedIndex);
        }


        // var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'img/m' });


    }

    function addInfoWindow(marker, message, record, infoWindow, map, count, allFeedsIndex) {
        if (count > 1) {
            console.log($scope.locationfiltervalue)
            var currentFilter = $scope.locationfiltervalue;
            var content = "<div style='font-weight: bold; font-size: 16px;'>There are " + count + " posts at this location";

            var Categories = [];
            for (var b = 0; b < count; b++) {
                Categories = Categories.concat(records[allFeedsIndex[b].index].feed.category);
                console.log("feed ", records[allFeedsIndex[b].index].feed)
            }
            console.log("categoris are", Categories.unique())
            var FinalCat = Categories.unique()
                // for (var j = 0; j < count; j++) {
                //     var ind = allFeedsIndex[j].index;
                //     var usrimg = '';
                //     if (records[ind].user.fb_profile) {
                //         usrimg = records[ind].user.fb_profile.profile;
                //     } else {
                //         if (records[ind].user.media.length != 0) {
                //             usrimg = records[ind].user.media[0].small;
                //         }
                //     }
            content += '<div id="iw-container-multiple">' +
                // '<div id="iw-user-img"><img src="' + usrimg + '" class="fd-img fd-img-br border-style"></div>' +
                // '<div id="iw-user-name">' + records[ind].user.name + '</div>' +
                '<div id="iw-img">' +
                '<img src="' + records[ind].feed.media[0].medium + '" style="width:100%; height:100%">' +
                '</div>' +
                '<div id="iw-title"><b>' + records[ind].feed.remark + '</b></div>' +
                '<div id="iw-location">' + records[ind].feed.location_name + '</div>' +
                '</div>'
                //records[ind].feed.remark + '</div>'
                //}
                // content += '<div id="iw-title" style="font-weight: normal; margin-top: 10px;">('
                // for (var i = 0; i < FinalCat.length; i++) {
                //     if (i == FinalCat.length - 1) {
                //         content += FinalCat[i]
                //     } else {
                //         content += FinalCat[i] + ", "
                //     }
                // }
                // content += ')</div>'

            content += "<div style='padding: 10px;' onclick='viewAllFeed(" + records[allFeedsIndex[0].index].feed.location[1] + "," + records[allFeedsIndex[0].index].feed.location[0] + ",\"" + records[allFeedsIndex[0].index].location.location_name + "\");'>View All</div>"
            marker.addListener('click', function() {
                infoWindow.setContent(content);
                infoWindow.open(map, this);
            });
        } else {
            var usrimg = '';
            var record = records[allFeedsIndex[0].index];
            if (record.user.fb_profile) {
                usrimg = record.user.fb_profile.profile;
            } else {
                try {
                    usrimg = record.user.media[0].medium;
                } catch (err) {

                }
            }

            var Categories = records[allFeedsIndex[0].index].feed.category;
            console.log("categoris are", Categories.unique())
            var FinalCat = Categories.unique()

            var content =
                '<div id="iw-title"><b>' + record.feed.remark + '</b></div>' +
                '<div id="iw-location">' + record.feed.location_name + '</div>' +
                '</div>'
                //    var content = "<div style='font-weight: bold; font-size: 16px;'>There is 1 post at this location";

            content += '<div id="iw-title" style="font-weight: normal; margin-top: 10px;">('
            for (var i = 0; i < FinalCat.length; i++) {
                if (i == FinalCat.length - 1) {
                    content += FinalCat[i]
                } else {
                    content += FinalCat[i] + ", "
                }
            }
            content += ')</div>'

            content += "<div onclick='viewAllFeed(" + record.feed.location[1] + "," + record.feed.location[0] + ",\"" + records[allFeedsIndex[0].index].location.location_name + "\");' style='margin-top:10px;'>View</div>"
            marker.addListener('click', function() {
                infoWindow.setContent(content);
                infoWindow.open(map, this);
            });
        }
    }

    $scope.search = {};
    $scope.$watch('search.locationtext', function(newValue) {
        if (newValue) {
            LocationService.searchAddress(newValue).then(function(result) {
                $scope.search.error = null;
                $scope.search.suggestions = result;
            }, function(status) {
                // $scope.search.error = "There was an error :( " + status;
            });
        };

        $scope.choosePlace = function(place) {
            $scope.search.locationtext = place.description;
            LocationService.getDetails(place.place_id).then(function(location) {
                console.log(location);
                //$rootScope.$broadcast('POSTLOCATION_CHANGED', {place: location});
                //$scope.close();

                var place = location;
                Posts.postSearchHistory({ location: [place.geometry.location.lat(), place.geometry.location.lng()], location_name: place.formatted_address }).success(function(res) {
                        console.log(res)
                        $scope.search.suggestions = [];
                    })
                    .error(function(erer) {

                    });
                initMap([place.geometry.location.lat(), place.geometry.location.lng()])

                console.log($scope.search.suggestions)
            });
        };
    });

})

/*
 * Find midpoint between two coordinates points
 * Source : http://www.movable-type.co.uk/scripts/latlong.html
 */

//-- Define radius function
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

//-- Define degrees function
if (typeof(Number.prototype.toDeg) === "undefined") {
    Number.prototype.toDeg = function() {
        return this * (180 / Math.PI);
    }
}

//-- Define middle point function
function middlePoint(lat1, lng1, lat2, lng2) {

    //-- Longitude difference
    var dLng = (lng2 - lng1).toRad();

    //-- Convert to radians
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lng1 = lng1.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    //-- Return result
    return [lng3.toDeg().toFixed(5), lat3.toDeg().toFixed(5)];
}


Array.prototype.unique = function() {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
