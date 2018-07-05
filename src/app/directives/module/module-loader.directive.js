'use strict';

cmsApp.directive('moduleLoader', moduleLoader);

function moduleLoader() {

  var directive = {
    restrict: 'E',
    bindToController: {
      moduleName: '@',
      url: '@',
      formName: '@',
      viewType: '@',
    },
    controllerAs: 'vm',
    name: 'ctrl',
    controller: '@',
    templateUrl: 'app/directives/module/module-loader.html',

  };

  return directive;

}
