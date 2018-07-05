cmsApp.factory('baseSvc', ['$http', '$q', '$rootScope', '$templateCache', '$log', 'CONFIG', function ($http, $q, $rootScope, $templateCache, $log, CONFIG) {
  'use strict';
  var SERVICE_URL = CONFIG.services.MASTER_DATA_SVCS_URL;
  var SERVICE_URL_MAIL = CONFIG.services.NOTIFICATION_SVCS_URL;
  console.log('SERVICE_URL= ' + SERVICE_URL);
  var getResult = {};
  return {
    create: function (uri, uiData) {
      console.log('SERVICE_URL= ' + SERVICE_URL + uri);
      console.log('SERVICE_URL= ' + JSON.stringify(uiData));
      return $http.post(SERVICE_URL + uri, uiData);
    },
    sendMail: function(uri, uiData) {
      console.log("sendMail"+SERVICE_URL_MAIL + uri + JSON.stringify(uiData));
      return $http.post(SERVICE_URL_MAIL + uri, uiData);
    },

    update: function (uri, id, data) {
      return $http.put(SERVICE_URL + uri + id, data);
    },

    delete: function (uri, data) {
      var url = SERVICE_URL + uri + data;
      return $http.delete(url);
    },

    listByParentId: function (uri, parentId, type) {
      return $http.get(SERVICE_URL + uri + parentId + type);
    },

    getInviteStatus: function (uri, currentPage, itemsPerPage) {
      return $http.get(SERVICE_URL + uri);
    },

    getByFilterSearchCriteria : function (uri, uiData) {
      console.log("values of request uri" ,uri)
      return $http.post(SERVICE_URL + uri, uiData);
    },

    getById: function (uri, id) {
      var result = [];
      var deferred = $q.defer();
      var URL = SERVICE_URL + uri + id;
      $http.get(URL).then(function (data) {
        deferred.resolve(data);
      }, function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },

    list: function (uri) {
      return $http.get(SERVICE_URL + uri);
    },

    getList: function (uri) {
      return $http.get(SERVICE_URL + uri)
        .success(function (data) {
          return data.result;
          if (callback) {
            callback(null, data);
          }
        })
        .error(function (data) {
          $log.info("Retrival failed!. Requested URL" + (SERVICE_URL + uri));
        });
    },

    getUserDetails: function (uri, code) {
      var deferred = $q.defer();
      $http.get(SERVICE_URL + uri + "?code=" + code).success(function (data) {
        deferred.resolve(data);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }
  };
}, ]);
