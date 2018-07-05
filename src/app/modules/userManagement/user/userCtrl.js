cmsApp.controller('userCtrl', UserCtrl);
function UserCtrl($scope, $rootScope, $log, $state, $stateParams, baseSvc, ROUTE_CONSTANTS, $uibModal, Utils) {
  'use strict';
  var vm = this;
  vm.updateView = false;
  vm.listView = false;
  vm.submitted = false;
  //Object Model declaration
  vm.modelUser = {};
  vm.users = [];
  vm.user = {};
  vm.usersCopy = [];
  $scope.dateFormat = "dd-MM-yyyy";
  //pagination
  vm.userTotalItems = 0;
  vm.itemsPerPage = 5;
  vm.currentPage = 1;

  $log.info('userCtrl()=' + $stateParams.viewType);
  setViewType(vm.viewType);
  var BASE_URI = ROUTE_CONSTANTS.API_BASE_URL;
  activate();

  vm.defaultAlert = 'Please enter required fields.';

  //function declaration to access outside
  vm.clear = clear;
  vm.addValue = addValue;
  vm.editValue = editValue;
  vm.setViewType = setViewType;
  vm.getUser = getUser;
  vm.openConfirmation = openConfirmation;
  vm.filterUser = filterUser;
  vm.userMail = userMail;
  vm.constructMailTemplate = constructMailTemplate;
  function clear() {
    vm.user = {};
    vm.submitted = false;
  }

  function activate() {

    $log.info("list screen" + vm.viewType);
    if ($stateParams && $stateParams.id) {
      vm.updateView = true;
      getUser($stateParams.id);
    } else {
      //vm.currency = {};
      getUserList();
    }
  }
  function getUserList() {
    baseSvc.list(BASE_URI + ROUTE_CONSTANTS.USERS_URI).then(function (response) {
      //$log.info('result: ' + JSON.stringify(response.data.result));
      vm.users = response.data.result;
      vm.userTotalItems = vm.users.length;
      vm.usersCopy = response.data.result;
    }, function (data, status, header, config) {
      vm.user = {};
      $log.info("Error in fetching user list");
    });
  }
  function setViewType(viewType) {
    if (viewType === 'create') {
      vm.updateView = false;
    } else if (viewType === 'update') {
      vm.updateView = true;
    }

    if (viewType === 'list') {
      vm.listView = true;
    }
  }

  function filterUser(searchUser) {
    if (searchUser) {
      vm.users = _.filter(vm.usersCopy, function (user) {
        var email = user.email;
        return (email.search(new RegExp(searchUser, "i")) !== -1);
      });
      vm.userTotalItems = vm.users.length;
      return null;
    }
    else {
      vm.users = vm.usersCopy;
    }
  }

  function goToListUsers() {
    vm.updateView = false;
    $state.go('main.listusers');
  }

  function editValue(id) {
    var idObj = { id: id, viewType: "update" };
    $state.go('main.edituser', idObj);
  }

  function getUser(id) {
    baseSvc.getById(BASE_URI + ROUTE_CONSTANTS.USER_CONTEXT, id).then(function (response) {
      vm.modelUser = response.data.result;
      $log.info('modelUser ' + JSON.stringify(vm.modelUser));
      $log.info('vm.updateView ' + vm.updateView);
      if (vm.updateView) {
        populateView(vm.modelUser);
      }
    }, function (err, status) {
      vm.defaultAlert = 'Internal Server Error; Error Code=' + status;
    });

  }

  function addValue() {
    var modelUser = {};
    if (vm.formName.$valid) {
      vm.submitted = false;
      vm.modelUser = populateModel(modelUser);
      $log.debug("modelUser" +JSON.stringify(modelUser));
      if (!vm.updateView) {
        $log.debug('ROUTE_CONSTANTS.USER.CREATE=' + (BASE_URI + ROUTE_CONSTANTS.USER_URI));
        baseSvc.create(BASE_URI + ROUTE_CONSTANTS.USER_URI, vm.modelUser).then(function (response) {
          $log.debug('CREATE RESULT=' + JSON.stringify(response));
          vm.openConfirmation();
          vm.userMail(modelUser);
          vm.clear();
        }, function (response, status) {
          $log.debug('httpstatus' + status);
          vm.submitted = true;
          vm.defaultAlert = 'Internal Server Error; Error Code=' + status;
        });
      } else {
        baseSvc.update(BASE_URI + ROUTE_CONSTANTS.USER_CONTEXT, $stateParams.id, modelUser)
          .then(function (response) {
            $log.debug('UPDATE RESULT=' + JSON.stringify(response));
            vm.openConfirmation();
            vm.userMail(modelUser);
          }, function (response, status) {
            vm.submitted = true;
            $log.debug('httpstatus' + status);
            vm.defaultAlert = 'Internal Server Error; Error Code=' + status;
          });
      }
    } else {
      vm.submitted = true;
    }
  }

  function openConfirmation() {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/common/dialog/confirmDialog.tpl.html',
      controller: 'ModalInstanceCtrl',
      size: 'sm',
      resolve: {
        moduleName: function () { return 'User'; },
      },
    });

    modalInstance.result.then(function (val) {
      $log.info("ok click vm.updateView" + vm.updateView);
      if (!vm.updateView) {
        clear();
        vm.updateView = false;
      } else {
        goToListUsers();
      }
    }, function () {

      $log.debug('failure' + new Date());
    });
  }

  function userMail(modelUser) {
      var mailModel = constructMailTemplate();
      $log.debug('ROUTE_CONSTANTS.USER_MAIL.CREATE=' + (BASE_URI + ROUTE_CONSTANTS.USER_MAIL));
      baseSvc.sendMail(BASE_URI + ROUTE_CONSTANTS.USER_MAIL, mailModel).then(function (response) {
      }, function (response, status) {
        $log.debug('httpstatus' + status);
        vm.submitted = true;
        vm.defaultAlert = 'Internal Server Error; Error Code=' + status;
      });
  }

  function constructMailTemplate() {
    var mailTemplate = {
      'firstName': vm.user.firstName,
      'lastName': vm.user.lastName,
      'email': vm.user.email
    }
    return mailTemplate;
  }
  $scope.openDeleteConfirmation = function (user) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/common/dialog/deleteConfirmationDialog.tpl.html',
      controller: 'ModalInstanceCtrl',
      size: 'sm',
      resolve: {
        moduleName: function () { return 'user'; },
      },
    });
    modalInstance.result.then(function (val) {
      deleteUser(user);
    }, function () {
      $log.debug('cancel' + new Date());
    });
  };

  function deleteUser(user) {
    baseSvc.delete(BASE_URI + ROUTE_CONSTANTS.USER_CONTEXT, user.id)
      .then(function (response) {
        vm.users = Utils.removeById(vm.users, user.id);
      }, function (response, status) {
        $log.debug('httpstatus' + status);
      });
  }

  function populateModel(modelObject) {
    var viewObject = vm.user;
    // User Definition
    if (viewObject._id) {
      modelObject._id = viewObject._id;
      modelObject.modifiedBy = 'Test updated User';
    } else {
      modelObject.insertedBy = 'Test inserted User';
    }

    modelObject.firstName = viewObject.firstName;
    modelObject.lastName = viewObject.lastName;
    modelObject.email = viewObject.email;
    modelObject.phoneNumber = viewObject.phoneNumber;
    modelObject.dob = new Date(viewObject.dob);
    $log.debug('model object' + JSON.stringify(modelObject));
    return modelObject;
  }

  function populateView(modelObject) {
    $log.debug("populateView Edit Page"+JSON.stringify(modelObject));
    var viewObject = vm.user;
    //Mapping View with Model
    viewObject._id = modelObject._id;
    viewObject.id = modelObject.id;
    viewObject.firstName = modelObject.firstName;
    viewObject.lastName = modelObject.lastName;
    viewObject.email = modelObject.email;
    viewObject.phoneNumber = modelObject.phoneNumber;
    viewObject.dob = new Date(modelObject.dob);
    $log.debug('viewObject Edit Page' + JSON.stringify(viewObject));
  }

}
