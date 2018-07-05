'use strict';
var cmsApp = angular.module('cmsApp', [
	'ui.router',
	'ngMaterial',
	'ui.bootstrap',
	'ngMessages',
	'lodash',
	'ngMask'
]);

cmsApp.config(function ($stateProvider, $urlRouterProvider, uibDatepickerConfig, MODULE_OBJ, MODULE, USER_ROLES, UtilsProvider) {

	//Disabled Date Picker Weeks column
	uibDatepickerConfig.showWeeks = false;
	UtilsProvider.$get().initStringFormat();
	$stateProvider
	.state('main', {
		url: '/',
		abstract: true,
		views: {
			menus: {
				templateUrl: 'app/common/sidebar.html'
			},
			'header@': {
				templateUrl: 'app/common/header.html',
				controller: 'authenticationCtrl'
			},
		},
	})
	.state('main.adduser', {
		url: 'main/user',
		data: {
			roles: [USER_ROLES.manager, USER_ROLES.head, USER_ROLES.administrator],
			module: MODULE_OBJ.USERMANAGEMENT
		},
		views: {
			'main@': {
				template: MODULE.CREATE_USER,
			},
		},
	})
	.state('main.edituser', {
		url: 'main/usermanagement/user/:id',
		data: {
			roles: [USER_ROLES.manager, USER_ROLES.head, USER_ROLES.administrator],
			module: MODULE_OBJ.USERMANAGEMENT
		},
		views: {
			'main@': {
				template: MODULE.EDIT_USER,
			},
		},
	})
	.state('main.listusers', {
		url: 'main/listusers',
		data: {
			roles: [USER_ROLES.executive,USER_ROLES.manager,USER_ROLES.head, USER_ROLES.administrator],
			module: MODULE_OBJ.USERMANAGEMENT
		},
		views: {
			'main@': {
				template: MODULE.LIST_USER,
			},
		},
	});
});

/**
* The run phase of the "cmsApp" could be useful for any initialization procedure.
**/
cmsApp.run(function ($log, $http, $rootScope, $state, $urlRouter, $location, $window) { // Inject Service to load data
	$log.debug('cmsApp.run');
	$rootScope.$state = $state;
});

cmsApp.factory('httpRequestInterceptor', ['$rootScope', function ($rootScope) {
	return {
		request: function ($config) {
			var token = window.localStorage.getItem('auth_token');
			$config.headers['Authorization'] = token;
			return $config;
		}
	};
}]);

cmsApp.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
}]);

cmsApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
}]);

$.get('/config', function (data) {
	cmsApp.constant('CONFIG', data);
	angular.bootstrap(document, ['cmsApp']);
})
