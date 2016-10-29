angular.module('AirPod.welcomeFactory', [])
    .factory('nearbyUserInfoService',function($rootScope,$http,$q){
        var urlBase = $rootScope.webhost+'business/findBusinessNearBy'
        var nearByUserInfo = {}
        nearByUserInfo.getUserInfoList = function(latlonData){
            var deferred = $q.defer()
            $http.post(urlBase,latlonData)
                .then(
                    function(response){
                        deferred.resolve({
                            data:response
                        })
                    },
                    function(response){
                        deferred.reject({
                            data:response
                        })
                    }
                )
            return deferred.promise
        }
        return nearByUserInfo
    }
    )
