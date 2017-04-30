angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js

    $stateProvider

        .state('mainscreen', {
        url: '/mainscreen',
        templateUrl: 'templates/main.html',
        controller: 'MainScreenController'
    })

    //id = 0 for brand
    //id = 1 for user
    .state('register', {
        url: '/register/:id',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
    })

    .state('categories', {
        url: '/categories',
        templateUrl: 'templates/categories.html',
        controller: 'CategoriesCtrl'
    })

    .state('selectdestination', {
        url: '/selectdestination',
        templateUrl: 'templates/selectdestination.html',
        controller: 'SelectDestinationCtrl',
        onEnter: function($state, localStorageService, $rootScope) {
            if (!localStorageService.get('loggedInUser')) {
                $state.go('mainscreen');
            }
        }
    })

    .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
    })

    .state('brandposts', {
        url: '/brandposts',
        templateUrl: 'templates/brandposts.html',
        controller: 'BrandpostsCtrl'
    })

    .state('feedlocation', {
        url: '/feedlocation',
        templateUrl: 'templates/feedlocation.html',
        controller: 'FeedLocationCtrl'
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    $urlRouterProvider.otherwise('/selectdestination')


});
