angular.module('AirPod.listMessageController', [])
    .controller('listMessageCtrl', function (getMessageFactory, $http,$rootScope,localStorageService, sendMessageService,$filter, $scope, listMessageService, updateMessageIsReadService) {
        $scope.messages = getMessageFactory.getMessage()
        $scope.viewSentMessage = false
        $scope.selectMessage = false
        $scope.checkboxChecked = false
        $scope.viewDetailedMessage = false
        $scope.clickReply = false
        $scope.showReplyContent = false
        $scope.checkShow = true
        $scope.limit =1
        $scope.checked = 0

        $scope.showTrashcan = function (val, messageid,index) {
            if (val) {
                $scope.selectMessage = true
                $scope.messageid = messageid
                $scope.index = index
                $scope.checked++
            } else {
                $scope.selectMessage = false
                $scope.checked--
            }
        }
        $scope.updateIsReadById = function (messageID) {
            $filter('filter')($scope.messages, {_id: messageID})[0].isRead = true;
            getMessageFactory.setMessage($scope.messages)
            getMessageFactory.getUnreadMessageCount()
            $rootScope.unreadMessageCount = getMessageFactory.getReadCount()
        }
        $scope.readChecked = function (messageID,index) {
            self.data = {'_id': messageID}
            updateMessageIsReadService.updateIsReadMessage(data)
                .then(function (data) {
                    console.log("suc: " + JSON.stringify(data))
                    $scope.updateIsReadById(data.data.data._id)
                    $scope.detailedMessage = $scope.messages[index]
                    console.log("index is : " +  index)
                    console.log("detialed Message is :" +$scope.detailedMessage.senderName )
                    $scope.viewDetailedMessage = true
                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                })
        }
        $scope.goReply = function(){
            $scope.clickReply = true
            $scope.messageContent=$scope.detailedMessage.content
        }

        $scope.sendReplyMessage = function(){
            $http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
            $scope.replyDetailed = $scope.replyContent + "*****"+"on"+ $scope.detailedMessage.sentDate+" "+$scope.detailedMessage.senderName+"wrote:"+$scope.messageContent
            self.data = {
                'receiverName':$scope.detailedMessage.senderName,
                'subject':$scope.detailedMessage.subject,
                'content':$scope.replyDetailed
            }
            sendMessageService.createMessage(data)
                .then(function(data) {
                    console.log("suc: " + JSON.stringify(data))
                    $scope.goBackToMailList()

                })
                .catch(function(err) {
                    console.log("error: " + JSON.stringify(err))

                });
        }

        $scope.showDetailedReplyMessage = function(){
            if($scope.checkShow){
                $scope.showReplyContent = true
                $scope.checkShow = false
            }else{
                $scope.showReplyContent = false
                $scope.checkShow = true

            }

        }

        $scope.goBackToMailList = function(){
            $scope.viewDetailedMessage = false
        }
        $scope.getSendboxMessage = function () {
            console.log("get sentbox button clicked!")
            listMessageService.getSendBoxMessage()
                .then(function (data) {
                    console.log("suc: " + JSON.stringify(data))
                    getMessageFactory.setSentMessage(data.data.data)
                    $scope.viewSentMessage = true
                    $scope.sentMessages = getMessageFactory.getSentMessage()
                    $scope.checkboxChecked = false

                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                })
        }

        $scope.getUnreadcount = function () {
            $http.defaults.headers.common.Authorization = localStorageService.get('authtoken');
            listMessageService.listMessage()
                .then(function (data) {
                    console.log("success: " + JSON.stringify(data))
                    getMessageFactory.setMessage(data.data.data)
                    $rootScope.unreadMessageCount = getMessageFactory.getUnreadMessageCount()
                    $scope.viewSentMessage = false
                    $scope.checkboxChecked = false
                    $scope.viewDetailedMessage = false
                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                })
        }
        $scope.getInboxMessage = function () {
            console.log("get inbox button clicked!")
            $scope.getUnreadcount()

        }

        $scope.deleteInboxMessages = function () {
            self.data = {'_id': $scope.messageid}
            listMessageService.deleteInMessage(data)
                .then(function (data) {
                    console.log("suc: " + JSON.stringify(data))
                    $scope.selectMessage = false
                    $scope.messages.splice($scope.index, 1);

                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                })
        }
        $scope.deleteSentBoxMessage = function(){
            self.data = {'_id': $scope.messageid}
            listMessageService.deleteSentMessage(data)
                .then(function (data) {
                    console.log("suc: " + JSON.stringify(data))
                    $scope.selectMessage = false
                    $scope.sentMessages.splice($scope.index, 1);
                })
                .catch(function (err) {
                    console.log("error: " + JSON.stringify(err))
                })
        }
        $scope.deleteMessages = function(){
            if($scope.viewSentMessage){
                $scope.deleteSentBoxMessage()
            }else{
                $scope.deleteInboxMessages()
            }
        }

        //法克
        //^on2016-10-15T20:22:52.051Z yishuwrote:olala
        //^on2016-10-08T20:20:44.036Z kekijkwrote:i want f**k you
         $scope.forwardMessageCount = 0
         parseReplyMessage = function(content){

        }
    })