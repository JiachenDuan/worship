angular.module('AirPod.mapController', [])
    .controller('mapCtrl',function ($scope, globalVariable,nearbyUserInfoService, $rootScope, $filter, moment, $state, UserPostInfoService, UserBusinessFactory, localStorageService) {

        $scope.$on('$viewContentLoaded', function () {
            var mapHeight = 700; // or any other calculated value
            $("#my-map .angular-google-map-container").height(mapHeight);
        });

        $scope.mylat = globalVariable.getLat()
        $scope.mylon = globalVariable.getLon()
        $scope.infos = globalVariable.getNearByUsers()

        $scope.map = {
            "center": {
                "latitude": $scope.mylat,
                "longitude": $scope.mylon
            },
            "zoom": 10,
            "markers": [],
            markersEvents: {
                click: function (marker, eventName, model) {
                    console.log('Click marker');
                    console.log("model is :" + model.id)
                    $scope.map.window.model = model;
                    $scope.rowSelected = model;
                    $scope.map.window.show = true;
                }
            },
            window: {
                marker: {},
                show: false,
                closeClick: function () {
                    this.show = false;
                },
                options: {
                    //boxClass: "infobox",
                    //boxStyle: {
                    //        width:"200px",
                    //        height:"200px",
                    //        backgroundColor: "#f9f9f9",
                    //        border: "2px solid d9d9d9"
                    //}
                }
            }
        };

        $scope.addMarkerItem = function (x) {
            $scope.map.markers.push(x)
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
        $scope.getUserInfo()



        angular.forEach($scope.infos, function (value, index) {
                this.markerItem = {
                    id: index,
                    latitude: value.loc.coordinates[1],
                    longitude: value.loc.coordinates[0],
                    price: value.price,
                    condition: value.condition,
                    leftorright: value.leftorright,
                    action: value.action,
                    description: value.description,
                    postDate: value.postDate,
                    username: value.username,

                };
                if (value.address !== undefined) {
                    this.markerItem.city = value.address.city,
                        this.markerItem.street = value.address.street,
                        this.markerItem.state = value.address.state,
                        this.markerItem.zipcode = value.address.zipcode,
                        this.markerItem.country = value.address.country
                }
                $scope.addMarkerItem(this.markerItem)
            })


        $scope.map.window.model = $scope.map.markers[0]
        $scope.rowSelected = $scope.map.markers[0]

        $scope.setClickedRow = function (index) {  //function that sets the value of selectedRow to current index
            $scope.selectedRowForClass = index
            $scope.rowSelected = this.info
            $scope.map.window.model = this.info
            $scope.map.window.show = true;
            $scope.getAirpodImage()

            if ($scope.rowSelected.state === undefined) {
                $scope.addressDefined = false

            } else {
                $scope.addressDefined = true

            }
            if ($scope.rowSelected.username === $rootScope.username) {
                $scope.notCurrentUserPosted = false

            } else {
                $scope.notCurrentUserPosted = true
            }

        }

        $scope.sortType = 'postDate';   //set the default sort type
        $scope.reverse = true;  // set the default sort order

        $scope.sortBy = function(sortType){
            $scope.reverse = (sortType !== null && $scope.sortType === sortType) ? !$scope.reverse : false;
            $scope.sortType = sortType

        }

        $scope.getAirpodImage = function () {
            console.log("$rootScope.emptyBusiness"+ $rootScope.emptyBusiness)
            if($rootScope.emptyBusiness){
                $scope.imageUrl = "img/airpods/both.jpg"
            }
           else if ($scope.rowSelected.leftorright == 'left') {
                $scope.imageUrl = "img/airpods/left.jpg"
            } else if ($scope.rowSelected.leftorright == 'right') {
                $scope.imageUrl = "img/airpods/right.jpg"
            } else {
                $scope.imageUrl = "img/airpods/both.jpg"
            }

        }
        $scope.getAirpodImage()


        $scope.goToSendPage = function (username) {
            UserPostInfoService.setUsername(username)
            $state.go('sendMessage')
        }

    })
