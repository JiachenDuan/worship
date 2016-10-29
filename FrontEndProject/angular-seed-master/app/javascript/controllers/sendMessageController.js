angular.module('AirPod.sendMessageController', [])
    .controller('sendMessageCtrl', function(sendMessageService,$location,$state,UserPostInfoService,$scope,localStorageService,$http){

        $scope.receiver = UserPostInfoService.getUsername()

        $scope.sendMessage = function(){
            $http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
            self.data = {
                'receiverName':$scope.receiver,
                'subject':$scope.subject,
                'content':$scope.content
            }
            sendMessageService.createMessage(data)
                .then(function(data) {
                    console.log("suc: " + JSON.stringify(data))
                    $state.go('listMessage')
                })
                .catch(function(err) {
                    console.log("error: " + JSON.stringify(err))

                });
        }
    })