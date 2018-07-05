cmsApp.controller('ModalInstanceCtrl', [ '$scope', '$uibModalInstance','moduleName', function ($scope, $uibModalInstance,moduleName) {
    $scope.moduleName = moduleName;
    $scope.deleteOk = function () {
        $uibModalInstance.close('');
    };
    $scope.ok = function () {
        $uibModalInstance.close('');
    };

}]);
