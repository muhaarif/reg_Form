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
        return strArray.map(function(val) { return val[propStr]; }).indexOf(searchStr)
      },
      add_batch_http_get: function(url){
        return { "method": "GET", "uri": url };
      },
      batch_request_header: function(){
       return {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Powered-By": "Express",
          "Content-Length": "81",
          "Date": new Date().toGMTString(),
          "Connection": "keep-alive"
        };
        /*return {
            "x-powered-by": "Express",
            "Content-type": "application/json; charset=utf-8"
          };*/
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
           mr["id"] = Utils.checkNotNull(json.value) ? json.value: "";
           mr["name"] = Utils.checkNotNull(json.name) ? json.name : "";
           return mr;
        });
      },
      currentDateWithDefaultTime: function(){
        //Set Time line to to 0:0:0:0
        var currentDateStr = new Date().toLocaleDateString();
        return new Date(currentDateStr);
      },
      setToDate: function(date){
        return new Date(date.setHours(23,59,59));
      }
  };
  return Utils;
});
