'use strict';

angular.module('v2App', [])
  .config(function ($routeProvider) {
    $routeProvider.
      when('/', {templateUrl: 'views/main.html',controller: 'MainCtrl'}).
      when('/welcome', {templateUrl: 'views/welcome.html',controller: 'MainCtrl'}).
      when('/friends', {templateUrl: 'views/friends.html',controller: 'MainCtrl'}).
      when('/about', {templateUrl: 'views/about.html',controller: 'MainCtrl'}).
      when('/news', {templateUrl: 'views/news.html',controller: 'MainCtrl'}).
      when('/football', {templateUrl: 'views/football.html',controller: 'MainCtrl'}).
      when('/kitchen', {templateUrl: 'views/kitchen.html',controller: 'MainCtrl'}).
      when('/bar', {templateUrl: 'views/bar.html',controller: 'MainCtrl'}).
      when('/events', {templateUrl: 'views/events.html',controller: 'MainCtrl'}).
      otherwise({redirectTo: '/'});
  });