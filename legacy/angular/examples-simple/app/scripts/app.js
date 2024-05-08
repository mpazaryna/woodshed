'use strict';

angular.module('simpleApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/binding', {
        templateUrl: 'views/binding.html',
        controller: 'MainCtrl'
      })
      .when('/iterate', {
        templateUrl: 'views/iterate.html',
        controller: 'MainCtrl'
      })
      .when('/controller', {
        templateUrl: 'views/controller.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
