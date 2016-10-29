angular.module('AirPod.navController', [])
    .controller('navCtrl', function ($scope,globalVariable, nearbyUserInfoService,$location, userBusiness, UserBusinessFactory, $interval, listMessageService, UserPostInfoService, getMessageFactory, $state, $rootScope, $http, localStorageService, globalVariable) {
        $scope.goToMap = false

        $scope.getUserInfo = function () {
            var mylat = globalVariable.getLat()
            var mylon = globalVariable.getLon()
            self.data = {"coordinates": [mylon, mylat], "distance": 500}
            nearbyUserInfoService.getUserInfoList(data)
                .then(function (data) {
                    console.log("suc: " + JSON.stringify(data))
                    console.log("data.data.data is:" +data.data.data[0])
                    if(data.data.data[0]===undefined){
                        $rootScope.emptyBusiness = true
                    }else{
                        globalVariable.setNearByUsers(data.data.data);
                        $rootScope.atMapPage = true
                    }
                    $state.go('map')
                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                    $scope.error = true
                })

        }
        $scope.goMap = function () {
            if(globalVariable.getLat()){
                $scope.getUserInfo()
            }else{
                $state.go('welcome')
            }
        }
        $rootScope.username = localStorageService.get('username')
        $scope.toLoginPage = function () {
            if ($scope.goToMap) {
                $scope.goToMap = false
                if ($rootScope.atMapPage) {
                    $state.go('map')
                } else {
                    $state.go('welcome')
                }
            } else {
                $scope.goToMap = true
                $state.go('login')
            }

        }

        $scope.logoff = function () {
            $rootScope.notauthenciated = true;
            console.log("removing authtoekn from localstorage...")
            localStorageService.remove('authtoken');
            localStorageService.remove('username');
            $http.defaults.headers.common.Authorization = undefined;
        }
        $scope.goToSignUp = function () {
            if ($scope.goToMap) {
                $scope.goToMap = false
                if ($rootScope.atMapPage) {
                    $state.go('map')
                } else {
                    $state.go('welcome')
                }
            } else {
                $scope.goToMap = true
                $state.go('signup')
            }

        }
        $scope.gosell = function () {
            if (!localStorageService.get('authtoken') && !$scope.goToMap) {
                $scope.goToMap = true
                $state.go('login')
            } else if (!localStorageService.get('authtoken') && $scope.goToMap) {
                $scope.goToMap = false
                $state.go('map')
            }
            else if ($scope.goToMap) {
                $scope.goToMap = false
                $state.go('map')
            }
            else {
                console.log("hit sell")
                globalVariable.setBusinessType("sell")
                console.log("business action is :" + globalVariable.getBusinessType())
                UserPostInfoService.setUserPostToNull()
                $scope.goToMap = true
                $state.go('form')
            }
        }
        $scope.gobuy = function () {
            if (!localStorageService.get('authtoken') && !$scope.goToMap) {
                $scope.goToMap = true
                $state.go('login')
            } else if (!localStorageService.get('authtoken') && $scope.goToMap) {
                $scope.goToMap = false
                $state.go('map')
            }
            else if ($scope.goToMap) {
                $scope.goToMap = false
                $state.go('map')
            }
            else {
                console.log("hit buy")
                globalVariable.setBusinessType("buy")
                UserPostInfoService.setUserPostToNull()
                $scope.goToMap = true
                $state.go('form')
            }
        }
        $scope.godonate = function () {
            if (!localStorageService.get('authtoken') && !$scope.goToMap) {
                $scope.goToMap = true
                $state.go('login')
            }
            else if (!localStorageService.get('authtoken') && $scope.goToMap) {
                $scope.goToMap = false
                $state.go('map')
            }
            else if ($scope.goToMap) {
                $scope.goToMap = false
                $state.go('map')
            }
            else {
                console.log("hit donate")
                globalVariable.setBusinessType("donate")
                UserPostInfoService.setUserPostToNull()
                $scope.goToMap = true
                $state.go('form')
            }
        }
        $scope.goCheckMessage = function () {
            if ($scope.goToMap) {
                $scope.goToMap = false
                if ($rootScope.atMapPage) {
                    $state.go('map')
                } else {
                    $state.go('welcome')
                }

            } else {
                $rootScope.unreadMessageCount = getMessageFactory.getReadCount()
                $scope.goToMap = true
                $state.go('listMessage')
            }
        }


        $scope.goMyPost = function () {
            if ($scope.goToMap) {
                $scope.goToMap = false
                if ($rootScope.atMapPage) {
                    $state.go('map')
                } else {
                    $state.go('welcome')
                }

            } else {
                $http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
                userBusiness.getUserBusiness()
                    .then(function (data) {
                        console.log("success: " + JSON.stringify(data))
                        UserBusinessFactory.setBusinessInfo(data.data.data)
                        $scope.goToMap = true
                        $state.go('postInfo')
                    })
                    .catch(function (err) {
                        console.log("error: " + JSON.stringify(err))
                    })
            }
        }

    })