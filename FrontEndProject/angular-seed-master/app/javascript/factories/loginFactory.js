angular.module('AirPod.loginFactory', [])
    .factory('userDataOp',function($rootScope,$http,$q){
        var urlBase = $rootScope.webhost+'users/login'
        var config = {
            headers : {
                'Content-Type': 'application/json'
            }
        }

        var userDataO = {}

         userDataO.loginUser = function(userInfo){
             var deferred = $q.defer()
             $http.post(urlBase,userInfo,config)
                 .then(
                     function(response){
                         console.log("Successful: response from submitting data to server was: " + response);
                         deferred.resolve({
                             data: response //RETURNING RESPONSE SINCE `DATA` IS NOT DEFINED
                         });
                     },
                   //ERROR:  called asynchronously if an error occurs or server returns response with an error status.
                      function(response) {
                          console.log("Error: response from submitting data to server was: " + response);
                          //USING THE PROMISE REJECT FUNC TO CATCH ERRORS
                          deferred.reject({
                          data: response //RETURNING RESPONSE SINCE `DATA` IS NOT DEFINED
                          });
                      }
                 )
             return deferred.promise;
         }
        return userDataO
    })
