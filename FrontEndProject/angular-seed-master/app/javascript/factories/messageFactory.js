angular.module('AirPod.messageFactory',[])
    .factory('sendMessageService',function($http,$rootScope,$q){
        var webUrl = $rootScope.webhost+'messages'
        var messageService = {}
        messageService.createMessage = function(postInfo){
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
        return messageService
    })
    .factory('listMessageService',function($http,$rootScope,$q){
        var webUrl = $rootScope.webhost+'messages/getInboxMessages'

        var messageService = {}
        messageService.listMessage = function(){
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

        messageService.getSendBoxMessage = function(){
            var webUrl = $rootScope.webhost+'messages/getSentboxMessages'
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

        messageService.deleteInMessage = function(messageId){
            var webUrl = $rootScope.webhost+'messages/deleteInboxMessage'
            var deferred = $q.defer()
            $http.post(webUrl,messageId)
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

        messageService.deleteSentMessage = function(messageId){
            var webUrl = $rootScope.webhost+'messages/deleteSentMessage'
            var deferred = $q.defer()
            $http.post(webUrl,messageId)
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


        return messageService
    })

    .factory('updateMessageIsReadService',function($http,$rootScope,$q){
        var webUrl = $rootScope.webhost+'messages/updateIsReadStatus'
        var messageService = {}
        messageService.updateIsReadMessage = function(messageID){
            var deferred = $q.defer()
            $http.post(webUrl,messageID)
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
        return messageService
    })



    .factory('getMessageFactory',function(){
        var messageslist;
        var sendMessageList;

        var setSentMessage = function(info){
            sendMessageList = info
        }
        var getSentMessage = function(){
            return sendMessageList
        }
        var setMessage = function(info){
            messageslist = info
        }
        var getMessage = function(){
            return messageslist
        }

        var unreadCount;
        var getUnreadMessageCount = function(){
            var unreadMessageCount= 0
            angular.forEach(messageslist,function(value){
                console.log("is read?" + value.isRead)
                if(!value.isRead){
                    unreadMessageCount++
                }
                console.log("check unread count : " + unreadMessageCount)
            })
            unreadCount = unreadMessageCount
            console.log("readcount is  : " + unreadCount)
            return unreadMessageCount
        }
        var getReadCount = function(){
            return unreadCount
        }

        return {
            setSentMessage:setSentMessage,
            getSentMessage:getSentMessage,
            setMessage:setMessage,
            getMessage:getMessage,
            getUnreadMessageCount:getUnreadMessageCount,
            getReadCount:getReadCount
        }
    })