var app = angular.module('savesd', ['ui.bootstrap', 'angular.filter', 'angulike']);
app.controller('savesdCtrl', function($scope, $http, $interpolate) {
    var context = "/save-sd/context/context.json";
    
    $scope.showIt = function(){
      alert("Pippo");  
    };
    
    $scope.createHTML = function(id, source) {
        $http.get(source).success(function(data) {
            $("#" + id).after(marked(data));
        });
    };
    
    $http.get(context).success(function(data) {
        $scope.base = data["@context"]["@base"];
        for (key in page_data) {
            current_files = page_data[key];
            $scope[key] = [];
            for (var i = 0; i < current_files.length; i++) {
                $http.get($scope.base + current_files[i] + "#" + key).success(function(data, status, headers, config) {
                    var current_key = config.url.split("#").pop();
                    $scope[current_key] = $scope[current_key].concat(data);
                    if (current_key == "head") {
                        $scope.pages = [];
                        var website = $scope.getFirstObjectByKeyValue('has_type', 'expression_collection', $scope.head);
                        for (var idx in website.has_part) {
                            var item = $scope.getFirstObjectByKeyValue("@id", website.has_part[idx], $scope.head);
                            if (item != null) {
                                $http.get($scope.base + item.has_representation).success(function(data, status, headers, config) {
                                    $scope.pages = $scope.pages.concat(data);
                                });
                            }
                        }
                    } else if (current_key == "data") {
                        $("title").html(
                            $("title").text() + " - " + 
                            $scope.getFirstObjectByKeyValue("has_type", "web_content", $scope.data).has_title);
                    }
                });
            }
        }
    });
    
    $scope.getItemsByKeyValue = function(key, value, list) {
        var result = [];
        
        if (list != null) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (key in item && item[key] == value) {
                    result.push(item);
                }
            }
        }
        
        return result;
    }
    
    $scope.getFirstItemByKeyValue = function(key, value, list) {
        if (list != null) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (key in item && item[key] == value) {
                    return [item];
                }
            }
        }
    }
    
    $scope.getFirstObjectByKeyValue = function(key, value, list) {
        var item = $scope.getFirstItemByKeyValue(key, value, list);
        if (item != null) {
            return item[0];
        }
    }
    
    $scope.isInPath = function(url) {
       return location.pathname.indexOf(url) > -1;
    };
});