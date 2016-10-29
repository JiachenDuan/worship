angular.module('AirPod.signupController', [])
    .controller('signupCtrl',function($scope, $location, $state, $rootScope,$http){

        $scope.dupUserError = false
        $scope.duplicateUserError = "Account alrady exists, forget your password?"

        $scope.showValue = function(){
            console.log($scope.username)
        }
        $scope.signupSubmit = function(){
            $scope.regeister()

        }
        $scope.regeister = function () {
            self.url = $rootScope.webhost+'users'

            var req = {
                method: 'POST',
                url: self.url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data:{
                    "username":$scope.username,
                    "email":$scope.email,
                    "password":$scope.password
                }
            }

            $http(req).then(function successCallback(response) {
                console.log("suc: " + JSON.stringify(response))
                $rootScope.signupSuccesseed = true
                $state.go('login')
            }, function errorCallback(response) {
                console.log("error: " + JSON.stringify(response))
                $scope.dupUserError = true
            });
        }
    })
