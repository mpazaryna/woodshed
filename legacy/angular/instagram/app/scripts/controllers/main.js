// The controller. Notice that I've included our instagram service which we
// defined below. It will be available inside the function automatically.

function SwitchableGridController($scope, instagram){

  // Default layout of the app. Clicking the buttons in the toolbar changes this value.
  $scope.layout = 'grid';
  $scope.pics = [];

  // Use the instagram service and fetch a list of the popular pics
  // Assigning the pics array will cause the view
  // to be automatically redrawn by Angular.

  instagram.fetchPopular(function(data){
    $scope.pics = data;
  });
}