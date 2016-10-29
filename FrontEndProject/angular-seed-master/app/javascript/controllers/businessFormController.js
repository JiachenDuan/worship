angular.module('AirPod.businessFormController', [])
    .controller('formCtrl',function($scope, globalVariable,UserPostInfoService,UserBusinessFactory,editBusinessService, getCountriesSvc,postFormService,googleGeoAPIService, localStorageService,$location, userBusiness,$state,$rootScope,$http) {
        // world countries
        $scope.countries = getCountriesSvc.getCoutries

        //get business option buy?sell?donate?
        $scope.selectedValue = globalVariable.getBusinessType()

        //get left?right?or both?
        $scope.getLeftOrRight = function () {
            if ($scope.checkedleft && $scope.checkedright) {
                $scope.leftRrightBoth = 'both'
            } else if ($scope.checkedleft) {
                $scope.leftRrightBoth = 'left'
            } else if ($scope.checkedright) {
                $scope.leftRrightBoth = 'right'
            }
        }
        //pre-selected country should be US
        $scope.selectedCountry= $scope.countries[229]


        //use current address checked or not
        $scope.checked =UserPostInfoService.getDetailedAddress()

        //$scope.checked = true;
        $scope.checkAddress  = function(){
            console.log("checked is " +$scope.checked )
            console.log("showAddress is " +$scope.showAddress )
            console.log("leftcheck"+$scope.checkedleft)
            console.log("leftcheck"+$scope.checkedright)
            console.log("leftrightorBoth" + $scope.leftRrightBoth)
            console.log("zip" + $scope.zip)
            console.log("street" + $scope.street)

        }

        //if user uncheck the chekbox, address section show
        $scope.addressShow = function(val){
            if(val){
                $scope.showAddress = false
            }else{
                $scope.showAddress = true
            }
        }
        $scope.addressShow($scope.checked)
        //initial business info value from globalvariable factory for editing
        $scope.action = UserPostInfoService.getAction()
        $scope.price = UserPostInfoService.getPrice()
        $scope._id = UserPostInfoService.getId()
        $scope.description = UserPostInfoService.getDescription()
        $scope.leftRrightBoth = UserPostInfoService.getLeftOfRight()
        $scope.condition = UserPostInfoService.getCondition()
        $scope.checkedleft = UserPostInfoService.getCheckedLeft()
        $scope.checkedright = UserPostInfoService.getCheckedRight()
        $scope.zip =  UserPostInfoService.getZip()
        $scope.street = UserPostInfoService.getStreet()
        $scope.city = UserPostInfoService.getCity()
        $scope.state = UserPostInfoService.getState()
        $scope.country = UserPostInfoService.getCountry()


        //submit function trigger when user finish edit form and hit submit button
        $scope.submit = function () {
            if($scope.checked){
                $scope.updateOrCreateBusiness()
            }else{
                $scope.getLatLonByAddress()
            }

        }
        $scope.updateOrCreateBusiness = function(){
            $scope.getLeftOrRight()
            $scope.lat = globalVariable.getLat()
            $scope.lon = globalVariable.getLon()
            $http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
            if($scope._id === undefined){
             self.data = {
                "action": $scope.selectedValue,
                "price": $scope.price,
                "leftorright": $scope.leftRrightBoth,
                "condition": $scope.condition,
                "description":$scope.description,
                "zipcode": $scope.zip,
                "street": $scope.street,
                "city": $scope.city,
                "state":$scope.state,
                "country":$scope.country,
                "type": "Point",
                "coordinates": [$scope.lon, $scope.lat]
             }

             postFormService.postForm(data)
                .then(function(data){
                    console.log("suc: " + JSON.stringify(data))
                    userBusiness.getUserBusiness()
                        .then(function(data){
                            console.log("success: " + JSON.stringify(data))
                            UserBusinessFactory.setBusinessInfo(data.data.data)
                            $state.go('postInfo')
                        })
                        .catch(function(err){
                            console.log("error: " + JSON.stringify(err))
                        })
                })
                .catch(function(err){
                    console.log("suc: " + JSON.stringify(err))
                })
            }else{
                self.data = {
                    "_id" : $scope._id,
                    "action": $scope.selectedValue,
                    "price": $scope.price,
                    "leftorright": $scope.leftRrightBoth,
                    "condition": $scope.condition,
                    "description":$scope.description,
                    "zipcode": $scope.zip,
                    "street": $scope.street,
                    "city": $scope.city,
                    "state":$scope.state,
                    "country":$scope.country,
                    "type": "Point",
                    "coordinates": [$scope.lon, $scope.lat]
                }

                editBusinessService.updateBusiness(data)
                    .then(function(data){
                        console.log("suc: " + JSON.stringify(data))
                        userBusiness.getUserBusiness()
                            .then(function(data){
                                console.log("success: " + JSON.stringify(data))
                                UserBusinessFactory.setBusinessInfo(data.data.data)
                                $state.go('postInfo')
                            })
                            .catch(function(err){
                                console.log("error: " + JSON.stringify(err))
                            })
                    })
                    .catch(function(err){
                        console.log("suc: " + JSON.stringify(err))
                    })
            }
        }

        //http get call to Google map api for getting latlon of user typed address
        $scope.getLatLonByAddress = function(){
            $http.defaults.headers.common.Authorization = undefined;
            $scope.mapPrameter = "address="+$scope.street+"&city="+$scope.city+"&state="+$scope.state+"&zip="
                +$scope.zip+"&country="+$scope.selectedCountry.name+"&key=AIzaSyAaBiOqxtGxQUoDrlb9nGlJA1I_L0qmY6Y&callback=initMap"
            self.url = $rootScope.googleMapurl+$scope.mapPrameter
            googleGeoAPIService.getLatLonFromGoogle(url)
                .then(function(data){
                    var keepGoing = true;
                    angular.forEach(data.data.results,function(value,index){
                        if(keepGoing){
                            $scope.addressLat=value.geometry.location.lat
                            $scope.addressLon=value.geometry.location.lng
                            if(index==0){
                                keepGoing=false
                            }
                        }
                    })
                    console.log("suc: lat:" + $scope.addressLat +",lon : "+ $scope.addressLon )
                    $scope.lat = $scope.addressLat
                    $scope.lon = $scope.addressLon
                    $scope.country = $scope.selectedCountry.name
                    $scope.updateOrCreateBusiness()
                })
                .catch(function(err) {
                    console.log("error: " + JSON.stringify(err))
                })

        }


    })
