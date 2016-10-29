angular.module('AirPod.formFactory',[])
    .factory('postFormService',function($http,$rootScope,$q){
        var webUrl = $rootScope.webhost+'business'
        var formService = {}
        formService.postForm = function(postInfo){
            var deferred = $q.defer()
            $http.post(webUrl,postInfo)
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
        return formService
    })

    .factory('editBusinessService',function($http,$rootScope,$q){
        var webUrl = $rootScope.webhost+'business/updateBusiness'
        var formService = {}
        formService.updateBusiness = function(postInfo){
            var deferred = $q.defer()
            $http.post(webUrl,postInfo)
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
        return formService
    })

    .factory('userBusiness',function($http,$rootScope,$q){
            var userBuesiness = {}
             var webUrl = $rootScope.webhost+'business/findUserBusiness'
                userBuesiness.getUserBusiness = function(){
                var deferred = $q.defer()
                $http.get(webUrl)
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
            return userBuesiness
        }

    )
    .factory('UserBusinessFactory',function($filter){
        var userBusinessInfo;
        var setBuseinessInfo = function(info){
            userBusinessInfo = info
        }
        var getBusinessInfo = function(){
            return userBusinessInfo
        }
        return {
            setBusinessInfo:setBuseinessInfo,
            getBusinessInfo:getBusinessInfo
        }
    })
    .factory('closeBusinessFactory',function($http,$rootScope,$q){
        var closeBusiness={}
        var webUrl = $rootScope.webhost+'business/closeBusiness'
        closeBusiness.deleteBusiness = function(businessId){
            var deferred = $q.defer()
            $http.post(webUrl,businessId)
                .then(
                    function(response){
                        deferred.resolve({
                            data: response
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
        return closeBusiness
    })
    .factory('UserPostInfoService',function($http,$rootScope,$q){
        var _id;
        var description;
        var action;
        var price;
        var leftorright;
        var condition;

        var zipcode;
        var street;
        var city;
        var state;
        var country;
        var detailedAddress = true;

        var usename;

        var setUsername = function(val){
            usename = val
        }

        var getUsername = function(){
            return usename
        }

        var setUserPostInfo = function(id1,action1,description1,price1,leftorright1,condition1){
            _id = id1
            action = action1
            price = price1
            description = description1
            leftorright = leftorright1
            condition = condition1
        }
        var setUserPostInfoAddress = function(zipcode1,street1,city1,state1,country1){
            zipcode = zipcode1
            street = street1
            city = city1
            state = state1
            country = country1
        }
        var setUserPostToNull = function(){
            _id = undefined
            action = undefined
            price = undefined
            description = undefined
            leftorright = undefined
            condition = undefined
            zipcode = undefined
            street = undefined
            city = undefined
            state = undefined
            country = undefined
        }
        var getId = function(){
            return _id
        }
        var getDescription = function(){
            return description
        }
        var getAction = function(){
            return action
        }
        var getPrice = function(){
            return price
        }
        var getLeftOfRight = function(){
            return leftorright
        }
        var getCheckedLeft = function(){
            if(leftorright == 'left' || leftorright == 'both' ){
                return  true
            }else{
                return false
            }
        }
        var getCheckedRight = function(){
            if(leftorright == 'right' || leftorright == 'both' ){
                return  true
            }else{
                return false
            }
        }
        var setDetailedAddress = function(){
            detailedAddress=false

        }
        var getDetailedAddress = function(){
            return detailedAddress
        }
        var getCondition = function(){
            return condition
        }


        var getZip = function(){
            return zipcode
        }
        var getStreet = function(){
            return street
        }
        var getCity = function(){
            return city
        }
        var getState = function(){
            return state
        }
        var getCountry = function(){
            return country
        }
        return {
            setUserPostInfo:setUserPostInfo,
            setUserPostInfoAddress:setUserPostInfoAddress,
            getId:getId,
            getDescription:getDescription,
            getAction:getAction,
            getPrice:getPrice,
            getLeftOfRight:getLeftOfRight,
            getCondition:getCondition,
            getZip:getZip,
            getStreet:getStreet,
            getCity:getCity,
            getState:getState,
            getCountry:getCountry,
            setDetailedAddress:setDetailedAddress,
            getDetailedAddress:getDetailedAddress,
            getCheckedLeft:getCheckedLeft,
            getCheckedRight:getCheckedRight,
            setUserPostToNull:setUserPostToNull,
            setUsername:setUsername,
            getUsername:getUsername
        }


    })
