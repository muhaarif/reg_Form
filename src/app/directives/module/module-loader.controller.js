cmsApp.controller('ModuleLoaderController', moduleLoaderController);

function moduleLoaderController($scope, $log) {
  var vm = this;
  $log.info("ModuleLoaderController=" + $scope.viewType)
}
