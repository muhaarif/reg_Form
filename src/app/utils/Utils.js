cmsApp.factory('Utils', function (){
  var Utils = {
      checkNotNull: function (value) {
        return (typeof value !== 'undefined' || value !== null || value !== "null") ;
      },
      checkKey : function(obj, key){
        return  obj.hasOwnProperty(key);
      },
      filterById: function(array){
        return array.map(function(obj){ return obj.id ? obj.id : ''; });
      },
      filterSelectedItemsByName: function(masterArray, modelArray){
        return masterArray.filter(function(obj){ return (modelArray  && modelArray.indexOf(obj.id) !== -1); });
      },
      filterMasterItemsByName: function(masterArray, modelArray){
        return masterArray.filter(function(obj){ return (modelArray && modelArray.indexOf(obj.id) === -1); });
      },
      filterSelectedItemsByParseInt: function(masterArray, modelArray){
        return masterArray.filter(function(obj){ return (modelArray  && modelArray.indexOf(obj.id) !== -1); });
      },
      filterMasterItemsParseInt: function(masterArray, modelArray){
        return masterArray.filter(function(obj){ return (modelArray && modelArray.indexOf(obj.id) === -1); });
      },
      getValueForQuotaType: function(arr, keyStr){
        if(arr && arr.length > 0){
           var extractArr = arr.find(function(obj){ return (obj.type===keyStr);});
           return extractArr ? extractArr.value: '';
        }else{
          return "";
        }

      },
      indexObject: function(strArray, propStr, searchStr){
        return strArray.map(function(val) { return val[propStr]; }).indexOf(searchStr);
      },
      add_batch_http_get: function(url){
        return { "method": "POST", "uri": url };
      },
      batch_request_header: function(){
       return {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Powered-By": "Express",
          "Content-Length": "81",
          "Date": new Date().toGMTString(),
          "Connection": "keep-alive"
        };

      },
      deep_copy: function(srcObj, destObj){
          angular.copy(srcObj, destObj);
      },
      batch_null_check : function(response){
        var result = [];
        if(response.statusCode < 400 && response.body && response.body !== null){
          result = response.body;
        }else{
          var keyNames = Object.keys(response);
          console.warn("Bad Response for a Batch Request="+keyNames[0]+"; Status Code="+response.statusCode);
        }
        return result;
      },
      map_reduce_generic_json: function(jsonList){
        return jsonList.map(function(json){
           var mr = {};
           mr.id = Utils.checkNotNull(json.value) ? json.value: "";
           mr.name = Utils.checkNotNull(json.name) ? json.name : "";
           return mr;
        });
      },
      currentDateWithDefaultTime: function(){
        //Set Time line to to 0:0:0:0
        var currentDateStr = new Date().toLocaleDateString();
        return new Date(currentDateStr);
      },
      setToDate: function(date){
        console.log("setdate  " +JSON.stringify(date));
        return new Date(date.setHours(23,59,59));
      },
      setEmptyIfNull: function (value) {
        return (typeof value === 'undefined' || value === null || value === "null") ? "" : value ;
      },
      removeById: function(array,id){
        return array.filter(function(obj){ return (obj.id !== id); });
      },
      containsById: function(array, value){
        return array.find(function(obj){ return obj.id === value.id; });
      },
      convertToJson: function(info) {
        return JSON.stringify(info);
      },
      convertToObj: function(jsonString) {
        return JSON.parse(jsonString);
      },
      autogenerateTicketId: function () {

      },
      findUserByEmail: function(userArray, email) {
        console.log("email" +JSON.stringify(userArray));
        return _.find(userArray, ['email', email]);
      },
      initStringFormat: function() {
        String.prototype.format = function() {
          let a = this;
          for (k in arguments) {
            a = a.replace("{" + k + "}", arguments[k])
          }
          return a
        }
      },
     filterJsonArray: function(filterArray, filterByProp, filterByValue) {
        if (filterByValue && _.isArray(filterArray)) {
          return _.find(filterArray, { filterByProp: filterByValue });
        }
        return [];
      }
  };
  return Utils;
});
