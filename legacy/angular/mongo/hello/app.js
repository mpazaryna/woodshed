var app = angular.module('app', ['mongolabResource']);

app.constant('API_KEY', '50aa996ee4b0c97193006e00');        
app.constant('DB_NAME', 'glow');
app.factory('Product', function ($mongolabResource) {
    return $mongolabResource('products');
});

app.controller('AppController', function ($scope, Product) {
    $scope.products = Product.query();
});