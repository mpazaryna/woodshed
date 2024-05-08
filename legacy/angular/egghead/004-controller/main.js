var myApp = angular.module('myApp', []);

// create a factory to share data between controllers
myApp.factory('Data', function() {
	return {message:"data from a service"}
})

function FirstCtrl($scope, Data) {
	$scope.data = Data;
}

function SecondCtrl($scope, Data) {
	$scope.data = Data;	
}