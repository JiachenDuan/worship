angular.module('AirPod.postInfoController', [])
    .controller('postInfoCtrl',function($scope,$state,UserBusinessFactory,closeBusinessFactory,globalVariable,UserPostInfoService,$filter){
            $scope.userBusinesses = UserBusinessFactory.getBusinessInfo()


            $scope.updateBusinessStatusById = function(businessID){
               $filter('filter')( $scope.userBusinesses, {_id:businessID})[0].status=false;


            }

            $scope.editBusinessById = function(businessID){
                $scope.selectedBusiness = $filter('filter')( $scope.userBusinesses, {_id:businessID})[0]
                //@param:action,description,price,leftorright,condition
                UserPostInfoService.setUserPostInfo(businessID,
                                                    $scope.selectedBusiness.action,
                                                    $scope.selectedBusiness.description,
                                                    $scope.selectedBusiness.price,
                                                    $scope.selectedBusiness.leftorright,
                                                    $scope.selectedBusiness.condition)
                console.log("selectedBusiness is: " +$scope.selectedBusiness.address)
                //@param:zipcode,street,city,state,country
                if($scope.selectedBusiness.address !== undefined){
                    UserPostInfoService.setUserPostInfoAddress(
                        $scope.selectedBusiness.address.zipcode,
                        $scope.selectedBusiness.address.street,
                        $scope.selectedBusiness.address.city,
                        $scope.selectedBusiness.address.state,
                        $scope.selectedBusiness.address.country
                    )
                    //set the edited post have detailed address to true
                    UserPostInfoService.setDetailedAddress()
                }
            }

            $scope.goToEdit = function(val){
                $scope.editBusinessById(val)
                globalVariable.setBusinessType($scope.selectedBusiness.action)
                $state.go("form")
            }
            $scope.closebusiness = function(val){
                console.log(val)
                self.data = {
                    "_id": val
                }
                closeBusinessFactory.deleteBusiness(data)
                    .then(function(data){
                        console.log("suc: " + JSON.stringify(data))
                        $scope.updateBusinessStatusById(val)
                        console.log("closed business is :" + $scope.userBusinesses)


                    })
                    .catch(function(err){
                        console.log("error: " + JSON.stringify(err))
                    })

            }

    })