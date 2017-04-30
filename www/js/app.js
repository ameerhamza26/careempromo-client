// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic', 'app.routes', 'ngCordova', 'app.controllers', 'app.directives', 'CoreApi', 'ionic.ui.modalService', 'LocalStorageModule', 'app.services'])

/**
 * @class Lodash
 * @description Defining lodash constant
 */
.constant('_', window._)

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.run(function($rootScope, localStorageService, $state) {

    $rootScope._ = window._;
    $rootScope.defaultUser = 'img/brand.png';
    $rootScope.defaultPost = 'img/deal.jpg';



    /**
     * @method logout
     * @description this method is used to logout from the App. After successfully logged out, localstorage becomes empty
     */

    $rootScope.logout = function() {

        $rootScope.user = null;
        localStorageService.set("auth_token", null);

        localStorageService.set("loggedInUser", null);

        localStorageService.set("loggedInUserUid", null);

        $state.go('mainscreen')


    }

})
