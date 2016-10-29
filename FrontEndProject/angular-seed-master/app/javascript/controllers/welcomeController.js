angular.module('AirPod.welcomeController', [])
    .controller('welcomeCtrl', function ($scope, $http, $interval,checkZipExistsService,googleGeoAPIService, nearbyUserInfoService, getMessageFactory, listMessageService, localStorageService, globalVariable, $location, $state, $rootScope) {
        $scope.checkedAddress = true
        $scope.addressInput = false
        //if user uncheck the chekbox, address section show
        $scope.addressShow = function (val) {
            if (val) {
                $scope.addressInput = false
            } else {
                $scope.addressInput = true
            }
        }

        function isEmpty(str) {
            return (!str || 0 === str.length);
        }
        $scope.mylon = 0;
        $scope.mylat = 0;
        $scope.mylocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position,error) {

                    if(error)
                    {

                    }

                    $scope.mylon = position.coords.longitude;
                    $scope.mylat = position.coords.latitude;
                    globalVariable.setLatLon($scope.mylat, $scope.mylon)
                    console.log($scope.mylat);
                    console.log($scope.mylon);
                    $scope.getUserInfo()
                });
            }
        }
        // header problem need to be solved
        $scope.checkZipExists = function(){
            //$http.defaults.headers.common.Authorization = undefined;
            //delete $http.defaults.headers.common['X-Requested-With']
            self.url = "https://www.zipcodeapi.com/rest/1j1hxjZBiH8BLSfk17dIbZfZAjLe4Ap5TrnqKm234aEP2Ua31oMcn1bXkXcpxBur/info.json/"+$scope.userSearchedLocation
            self.headers = {
                'Content-Type': undefined
            }
            checkZipExistsService.checkZip(url,headers)
                .then(function(data){
                    console.log("suc: " + JSON.stringify(data))
                    //$http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
                })
                .catch(function(err){
                    console.log("error: " + JSON.stringify(err))
                })

        }
        $scope.getLatlon = function () {

            console.log("userSearchedLocation:" + $scope.userSearchedLocation)
            console.log("userSearchedLocation:" + isEmpty($scope.userSearchedLocation))
            if ($scope.userSearchedLocation === undefined || isEmpty($scope.userSearchedLocation)) {
                console.log("userSearchedLocation:" + $scope.userSearchedLocation)
                //show the spinner while waiting for getting location
                $('.search-spinner').show();
                // $('.search-container').hide();
                $scope.mylocation()
                } else {
                    //$scope.checkZipExists()
                    $scope.getLatLonByAddress()
                }

        }

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

        $scope.getUnreadcount = function () {
            $http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
            listMessageService.listMessage()
                .then(function (data) {
                    console.log("success: " + JSON.stringify(data))
                    getMessageFactory.setMessage(data.data.data)
                    $rootScope.unreadMessageCount = getMessageFactory.getUnreadMessageCount()
                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                })
        }
        if (localStorageService.get('authtoken')) {
            $scope.getUnreadcount()
        }
        //$interval(refreshMessageList, 6000);

        function refreshMessageList() {
            console.log("refresh Message list occurred...");
            $scope.getUnreadcount()
        }


        //get latlon from input field
        $scope.getLatLonByAddress = function () {
            $http.defaults.headers.common.Authorization = undefined;
            $scope.mapPrameter = "&address="
                + $scope.userSearchedLocation + "&key=AIzaSyAaBiOqxtGxQUoDrlb9nGlJA1I_L0qmY6Y&callback=initMap"
            self.url = $rootScope.googleMapurl + $scope.mapPrameter
            googleGeoAPIService.getLatLonFromGoogle(url)
                .then(function (data) {
                    console.log("success: " + JSON.stringify(data))
                    var keepGoing = true;
                    angular.forEach(data.data.data.results, function (value, index) {
                        if (keepGoing) {
                            $scope.addressLat = value.geometry.location.lat
                            $scope.addressLon = value.geometry.location.lng
                            if (index == 0) {
                                keepGoing = false
                            }
                        }
                    })
                    console.log("suc: lat:" + $scope.addressLat + ",lon : " + $scope.addressLon)
                    globalVariable.setLatLon($scope.addressLat, $scope.addressLon)
                    $scope.getUserInfo()
                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                })

        }
    })