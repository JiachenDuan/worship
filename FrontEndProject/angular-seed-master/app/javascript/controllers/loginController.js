angular.module('AirPod.loginController', [])
    .controller('loginCtrl',function($scope, $location, $state,$rootScope,getMessageFactory,listMessageService,userDataOp,localStorageService,globalVariable,$http){
        $scope.authenticationFailed = false
        $scope.signupSuccesseedMessage = "Sign up success, please log in."


        $scope.login = function(){
            self.data = {'username':$scope.username,'password':$scope.password}
            userDataOp.loginUser(data)
                .then(function(data) {
                    console.log("suc: " + JSON.stringify(data))
                    $scope.authtoken = data.data.data.token
                    localStorageService.set('authtoken', $scope.authtoken)
                    localStorageService.set('username', $scope.username)
                    // Set the token as header for your requests!
                    $http.defaults.headers.common.Authorization = $scope.authtoken;
                    $scope.lat = globalVariable.getLat()
                    console.log($scope.lat)
                    $rootScope.notauthenciated = false
                    $scope.getUnreadcount()
                    if($scope.lat === undefined){
                        $state.go('welcome')
                    }else{
                        $state.go('map')
                    }
                })
                .catch(function(err) {
                    console.log("error: " + JSON.stringify(err))
                    $scope.authenticationFailed = true
                    $scope.errorMessage = err.data.data
                });
        }

        $scope.getUnreadcount = function(){
            $http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
            listMessageService.listMessage()
                .then(function(data){
                    console.log("success: " + JSON.stringify(data))
                    getMessageFactory.setMessage(data.data.data)
                    $rootScope.unreadMessageCount = getMessageFactory.getUnreadMessageCount()
                })
                .catch(function(err){
                    console.log("error: " + JSON.stringify(err))
                })
        }
    })
