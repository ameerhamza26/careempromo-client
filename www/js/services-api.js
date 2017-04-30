/**
 * Core Api submodule
 * 
 * @module CoreApi
 * @requires CoreApiUtilities
 */

angular.module('CoreApi', ['CoreApiUtilities'])


/**
 * @class lagConfig
 * @description Defining constants Like App Name, App Version and Api Url
 */
.constant('lagConfig', {
    appName: 'CareemPromos',
    appVersion: '1.0.0',
    //apiUrl: 'http://172.15.59.143:30001/'
    apiUrl: 'http://ec2-35-154-156-24.ap-south-1.compute.amazonaws.com:30001/'

}) 

/**
 * @class httpService
 * @constructor
 * @description It contains method definitions to make http requests to APIs, and building Api Url.
 * @param {module} $http
 * @param {class} lagConfig
 * @param {class} Utils
 */
.factory('httpService', ['$http', 'lagConfig', 'Utils', function($http, lagConfig, Utils) {
    return {
        $http: $http,
        lagConfig: lagConfig,
        Utils: Utils
    }
}])

/**
 * @class User
 * @constructor
 * @description It is Food Monger User service that contains methods to Call Api belonging to User
 * @param {class} httpService
 */
.service('User', ['httpService', function(httpService) {
    /**
    * @method User.login
    * @desciption It is used to call Login Api
    * @param {object} param it is a object that contains login email and password
    * @returns {promise} It return Http Post response with promise
    */
    this.login = function(param) {
        var config = httpService.Utils.getHeader();
        console.log("in config", config)
        var url = httpService.Utils.buildUrl(new Array('login'));
        return httpService.$http.post(url, param, config);
    }

    /**
    * @method User.register
    * @desciption It is used to call Sign Up Api
    * @param {object} param it is a object that contains sign up details like name, email, password etc
    * @returns {promise} It return Http Post response with promise
    */
    this.register = function(param) {
        var url = httpService.Utils.buildUrl(new Array('register'));
        return httpService.$http.post(url, param, {});
    }

    /**
    * @method User.registerWithFacebook
    * @desciption It is used to call Sign Up Api with Facebook
    * @param {object} param it is a object that contains sign up details like name, email, password etc
    * @param {string} facebookid it is user's facebook id
    * @returns {promise} It return Http Post response with promise
    */
    this.registerWithFacebook = function(param, facebookid) {
        var url = httpService.Utils.buildUrl(new Array('register', 'facebook', facebookid));
        return httpService.$http.post(url, param, {})
    }

    /**
    * @method User.registerWithGoogle
    * @desciption It is used to call Sign Up Api with Google
    * @param {object} param it is a object that contains sign up details like name, email, password etc
    * @param {string} googleid it is user's google id
    * @returns {promise} It return Http Post response with promise
    */
    this.registerWithGoogle = function(param, googleid) {
        var url = httpService.Utils.buildUrl(new Array('register', 'google', googleid));
        return httpService.$http.post(url, param, {})
    }

    /**
    * @method User.googleAuthentication
    * @desciption It is used to call google authentication Api after calling Sign Up Api with Google Api
    * @param {object} param it is a object
    * @returns {promise} It return Http Post response with promise
    */
    this.googleAuthentication = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('auth', 'google'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.update_categories
    * @desciption It is used to call consumer answers API that contains onboarding questions answers
    * @param {object} param it is a object
    * @returns {promise} It return Http Post response with promise
    */
    this.update_categories = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('updatecategories'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.updateprofile
    * @desciption It is used to call upadate profile API
    * @param {object} param it is a object
    * @returns {promise} It return Http Post response with promise
    */
    this.updateprofile = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('update', 'profile'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.updateprofileimage
    * @desciption It is used to call upadate profile image API
    * @param {object} param it is a object
    * @returns {promise} It return Http Post response with promise
    */
    this.updateprofileimage = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('update', 'profile', 'image'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.getUser
    * @desciption It is used to call get User Api by specific ID
    * @param {string} param it is an Id of User
    * @returns {promise} It return Http get response with promise
    */
    this.getUser = function(id) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('consumer', id));
        return httpService.$http.get(url, config);
    }

    /**
    * @method User.getUserPost
    * @desciption It is used to call get User Posts Api by specific user ID. It returns all posts from specific user
    * @param {string} param it is an Id of User
    * @returns {promise} It return Http get response with promise
    */
    this.getUserPost = function(id) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('user', id, 'post'));
        return httpService.$http.get(url, config);
    }

    /**
    * @method User.logout
    * @desciption It is used to call logout Api from Food Monger App and Server
    * @returns {promise} It return Http Post response with promise
    */
    this.logout = function() {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('logout'));
        return httpService.$http.post(url, {}, config);
    }

    /**
    * @method User.facebookAuthentication
    * @desciption It is used to call facebook authentication Api after calling Sign Up Api with Facebook Api
    * @param {object} param it is a object
    * @returns {promise} It return Http Post response with promise
    */
    this.facebookAuthentication = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('auth', 'facebook'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.checkFacebookUser
    * @desciption It is used to check weather user already has registered from facebook or not.
    * @param {object} param it is a object
    * @returns {promise} It return Http get response with promise
    */
    this.checkFacebookUser = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('facebook', params.id));
        console.log(url)
        return httpService.$http.get(url, config);
    }

    /**
    * @method User.search
    * @desciption It is used to call Search Api. The search can be User or tags as well depending on params.
    * @param {object} param it is a object
    * @returns {promise} It return Http get response with promise
    */
    this.search = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('search'), params);
        return httpService.$http.get(url, config);
    }

    /**
    * @method User.forgotpassword
    * @desciption It is used to call forgotpassword Api.
    * @param {object} param it is a object
    * @returns {promise} It return Http Post response with promise
    */
    this.forgotpassword = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('forgetpassword'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.verifytoken
    * @desciption It is used to call verifytoken Api after calling forget password API.
    * @param {object} param it is an object
    * @returns {promise} It return Http Post response with promise
    */
    this.verifytoken = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('verifytoken'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.resetpassword
    * @desciption It is used to call resetpassword Api after calling verifyitoken API.
    * @param {object} param it is an object
    * @returns {promise} It return Http Post response with promise
    */
    this.resetpassword = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('resetpassword'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method User.changepassword
    * @desciption It is used to call changepassword Api.
    * @param {object} param it is an object
    * @returns {promise} It return Http Post response with promise
    */
    this.changepassword = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('account','changepassword'));
        return httpService.$http.post(url, params, config);
    }
}])

/**
 * @class Posts
 * @constructor
 * @description It is Food Monger Posts service that contains methods to Call Api belonging to Posts
 * @param {class} httpService
 */
.service('Posts', ['httpService', function(httpService) {
    /**
    * @method Posts.getCategories
    * @desciption It is used to call getCategories Api to get All Food Categories.
    * @returns {promise} It return Http get response with promise
    */
    this.getCategories = function() {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('categories'));
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.create
    * @desciption It is used to call create Post API.
    * @param {object} param it is an object that contains post parameters like remarks, price, post_image_id
    * @returns {promise} It return Http Post response with promise
    */
    this.create = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts'));
        return httpService.$http.post(url, params, config);
    }
    /**
    * @method Posts.update
    * @desciption It is used to call update Post API.
    * @param {object} param it is an object that contains post parameters like remarks, price
    * @param {string} postid it is the id of post which is going to update
    * @returns {promise} It return Http Post response with promise
    */
    this.update = function(params, postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'edit'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method Posts.get
    * @desciption It is used to call get Post API with specific ID to get details of that post.
    * @param {string} postid It is an specific post id
    * @returns {promise} It return Http get response with promise
    */
    this.get = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid));
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.getSpecificLocationPost
    * @desciption It is used to call getSpecificLocationPost API to get All posts on that specific location.
    * @param {object} queryParams It is an object
    * @returns {promise} It return Http get response with promise
    */
    this.getSpecificLocationPost = function(queryParams) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('feeds'), queryParams);
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.getAllFeeds
    * @desciption It is used to call getAllFeeds API to get All posts on dashboard.
    * @param {object} queryParams It is an object
    * @returns {promise} It return Http get response with promise
    */
    this.getAllFeeds = function(urlParams) {
        var config = httpService.Utils.getHeader();
        // config.headers['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // config.headers['Cache-Control'] = 'no-cache';
        // config.headers['Pragma'] = 'no-cache';
        urlParams.ts = Math.floor(Date.now()/1000);
        var url = httpService.Utils.buildUrl(new Array('feeds'), urlParams);
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.postCategories
    * @desciption It is used to call postCategories API to get All categories of post.
    * @param {object} params It is an object
    * @returns {promise} It return Http get response with promise
    */
    this.postCategories = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('categories'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method Posts.addLike
    * @desciption It is used to call addLike API to specific post.
    * @param {string} postid It is a specific post id
    * @returns {promise} It return Http Post response with promise
    */
    this.addLike = function(postid) {
        var config = httpService.Utils.getHeader();
        console.log("config", config)
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'like'));
        return httpService.$http.post(url, {}, config);
    }

    /**
    * @method Posts.removeLike
    * @desciption It is used to call removeLike API to specific post.
    * @param {string} postid It is a specific post id
    * @returns {promise} It returns Http delete response with promise
    */
    this.removeLike = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'unlike'));
        return httpService.$http.delete(url, config);
    }

    /**
    * @method Posts.deletePost
    * @desciption It is used to call deletePost API.
    * @param {string} postid It is a specific post id
    * @returns {promise} It returns Http delete response with promise
    */
    this.deletePost = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid));
        return httpService.$http.delete(url, config);
    }

    /**
    * @method Posts.addComment
    * @desciption It is used to call addComment API on specific post.
    * @param {string} postid It is a specific post id
    * @returns {promise} It returns Http post response with promise
    */
    this.addComment = function(params, postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'comments'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method Posts.getAllComments
    * @desciption It is used to call getAllComments API on specific post.
    * @param {string} postid It is a specific post id
    * @returns {promise} It returns Http get response with promise
    */
    this.getAllComments = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'comments'));
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.getAllLikes
    * @desciption It is used to call getAllLikes API on specific post.
    * @param {string} postid It is a specific post id
    * @returns {promise} It returns Http get response with promise
    */
    this.getAllLikes = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'like'));
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.deleteComment
    * @desciption It is used to call deleteComment API on specific post.
    * @param {string} postid It is a specific post id
    * @returns {promise} It returns Http delete response with promise
    */
    this.deleteComment = function(postid, commentid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'comments', commentid));
        return httpService.$http.delete(url, config);
    }

    /**
    * @method Posts.insertLocation
    * @desciption It is used to call insertLocation API to insert current location/home location of user depend on parameters.
    * @param {object} params It is an object
    * @returns {promise} It returns Http post response with promise
    */
    this.insertLocation = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('location'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method Posts.insertHomeLocation
    * @desciption It is used to call insertHomeLocation API to insert home location of user.
    * @param {object} params It is an object
    * @returns {promise} It returns Http post response with promise
    */
    this.insertHomeLocation = function(params, urlParams) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('location'), urlParams);
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method Posts.insertCurrentLocation
    * @desciption It is used to call insertCurrentLocation API to insert Current location of user.
    * @param {object} params It is an object
    * @returns {promise} It returns Http post response with promise
    */
    this.insertCurrentLocation = function(params, urlParams) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('location'), urlParams);
        return httpService.$http.post(url, params, config);
    }

    this.postSearchHistory = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('search', 'history'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method Posts.getSuggestedTags
    * @desciption It is used to call getSuggestedTags API to get tags from google after post image is uploaded successfully.
    * @param {string} imageid It is a post image id
    * @returns {promise} It returns Http get response with promise
    */
    this.getSuggestedTags = function(imageid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('gcloud', 'tag', imageid));
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.feedback
    * @desciption It is used to call feedback API to post feedback to Foodmonger
    * @param {object} params It is an object
    * @returns {promise} It returns Http post response with promise
    */
    this.feedback = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('feedback'));
        return httpService.$http.post(url, params, config);
    }

    /**
    * @method Posts.getTagFeeds
    * @desciption It is used to call getTagFeeds API to all posts of specific tag.
    * @param {string} tagname It is a tagname
    * @param {object} urlparams It is an object passed in URL
    * @returns {promise} It returns Http get response with promise
    */
    this.getTagFeeds = function(tagname, urlparams) {
        var urlParams = urlparams || {};
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('tag', tagname), urlParams);
        return httpService.$http.get(url, config);
    }

    /**
    * @method Posts.shareTemplate
    * @desciption It is used to share feed template on social media apps like whatsapp, facebookAuthentication
    * @param {string} postid It is id of post which is to be shared
    * @param {object} bodyparams It is an object passed in body of api
    * @returns {promise} It returns Http post response with promise
    */

    this.shareTemplate = function(postid, bodyparams) {
        //shareimage/57c3c536ac5a69612f0e089b?imageof=share
        var urlParams = { 'imageof' : 'share'};
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('shareimage', postid), urlParams);
        return httpService.$http.post(url, bodyparams, config);
    }
}])

/**
 * CoreApiUtilities submodule of CoreApi
 * 
 * @module CoreApiUtilities
 */

angular.module('CoreApiUtilities', [])

/**
 * @class Utils
 * @constructor
 * @description It is Utils class that contains basic method like makeheader, buildUrl, getUrl parameters
 * @param {class} lagConfig
 * @param {module} localStorageService
 */
.factory('Utils', ['lagConfig', 'localStorageService', function(lagConfig, localStorageService) {
    /**
    * @method Utils.makeHeader
    * @desciption It is used to make header which will be send to access API. It first check localstorage to get authentication token, if it is found in local storage then header object is made accordingly. If token is not found in localstorage, than empty header is set  
    * @returns {object} It returns header object
    */
    var makeHeader = function() {
        var access_token = localStorageService.get('auth_token');
        if (access_token != null) {
            return config = {
                headers: {
                    'x-access-token': access_token
                }
            };
        } else {
            return config = {
                headers: {}
            };
        }
    }

    var defaultOffsetLimit = { offset: 0, limit: 5 }

    /**
    * @method Utils.buildUrl
    * @desciption It is used to make build a url. It convert JSON params to query string by calling 'toQueryString' method. e.g { 'a' : 'value', 'b': 'value'} is converted to 'a=value&b=value'. Also it converts Array to pass in a url. for e.g. Array contains [a,b], then it is passed in a url like this /a/b
    * @param {array} urlSet
    * @param {object} queryStringSet it is an object
    * @returns {string} It returns string of final url
    */
    var buildUrl = function(urlSet, queryStringSet) {

        queryStringSet = queryStringSet || false;
        var url = lagConfig.apiUrl;
        if (Object.prototype.toString.call(urlSet) === '[object Array]') {
            url += urlSet.toURL();
        }
        if (queryStringSet !== false) {
            url += '?' + toQueryString(queryStringSet);
        }
        return url;
    }

    return {
        getHeader: makeHeader,
        buildUrl: buildUrl,
        defaultOffsetLimit: defaultOffsetLimit
    };
}])

Array.prototype.toURL = function() {
    return this.join('/');
};

var toQueryString = function(obj) {
    var out = new Array();
    for (key in obj) {
        out.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return out.join('&');
};