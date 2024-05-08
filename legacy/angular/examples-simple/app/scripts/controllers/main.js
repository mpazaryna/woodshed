'use strict';

angular.module('simpleApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

function FirstCtrl($scope){
  $scope.data = {message: "Hello. World"};
}