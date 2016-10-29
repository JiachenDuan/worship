'use strict';
angular.module('AirPod',
    ['uiGmapgoogle-maps',
        'ui.router',
        'AirPod.services',
        'angularMoment',
        'AirPod.navController',
        'AirPod.loginController',
        'AirPod.signupController',
        'AirPod.businessFormController',
        'AirPod.welcomeController',
        'AirPod.postInfoController',
        'AirPod.mapController',
        'AirPod.sendMessageController',
        'AirPod.listMessageController',
        'AirPod.loginFactory',
        'AirPod.welcomeFactory',
        'AirPod.formFactory',
        'AirPod.messageFactory',
        'Airpod.directives',
        'AirPod.filters',
        'LocalStorageModule'
    ])



    .config(function ($locationProvider, $stateProvider,$httpProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'html/login.html',
                controller: 'loginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'html/signup.html',
                controller: 'signupCtrl'
            })
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'html/welcome.html',
                controller: 'welcomeCtrl'
            })
            .state('form', {
                url: '/form',
                templateUrl: 'html/form.html',
                controller: 'formCtrl'
            })
            .state('postInfo', {
                url: '/postInfo',
                templateUrl: 'html/postInfo.html',
                controller: 'postInfoCtrl'
            })
            .state('map', {
                cache: false,
                url: '/map',
                templateUrl: 'html/map.html',
                controller: 'mapCtrl'
            })
            .state('sendMessage', {
                url: '/sendMessage',
                templateUrl: 'html/sendMessage.html',
                controller: 'sendMessageCtrl'
            })
            .state('listMessage', {
                url: '/listMessage',
                templateUrl: 'html/listMessage.html',
                controller: 'listMessageCtrl'
            })
            .state('index', {
                url: '/',
                templateUrl: 'index.html'
            })

        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        //$httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
        //$httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        //$httpProvider.defaults.useXDomain = true;

    })

    .run(function ($location, $state, $stateParams,localStorageService,getMessageFactory,$rootScope,amMoment) {
        console.log("apps.run...")
        console.log("authtoken is :" + localStorageService.get('authtoken') )
        amMoment.changeLocale('de');
        $rootScope.webhost = ""
        $rootScope.googleMapurl = "https://maps.googleapis.com/maps/api/geocode/json?"
        $location.path('/welcome');

        if (!localStorageService.get('authtoken')) {
            $rootScope.notauthenciated = true
        }else{
            $rootScope.notauthenciated = false
            $rootScope.username = localStorageService.get('username')

        }
    })


