/**
 * Created by Jiachen on 9/13/16.
 */
module.exports = function () {

    var module = {};
    var User = require('../models/user'),
        Message = require('../models/message'),
        jwt = require('jwt-simple'),
        config = require('../config/property'),
        tokenUtils = require('../utils/tokenUtils'),
        mailUtils = require('../utils/mailUtils')


    /**
     *  create reusable transporter object using the default SMTP transport
     */
    var mailOptions = {
        from:'"Airpodslost.com" <contact@airpodslost.com>', //sender address
        to: 'jiachen.duan@gmail.com',  // receiver
        subject: 'Hello', //subject line
        text: 'Hello world', //plaintext body
        html: '<b>Hellow World</b>'
    }
    module.sendMail = function (req, res) {
       res.jsonp(new mailUtils().sendEmail(mailOptions))
    }
    /**
     receiverName: name of message receiver | required | string
     senderName: name of message sender     | required | string
     isShowInBox: true means receiver does not delete this message | required, default true | boolean
     isShowSentBox: true means sender does not delete this message | required, default true | boolean
     content:  content of the message, 200 character   | required | string
     isRead: if the message has been read by receiver  | required | string
     date:  date of the message sent out, default today's Date | required | string
     **/

    /**
     * POST
     * Create a new message,same as send message
     * 1. create message in db
     * 2. send message from message@airpodslost.com to message receiver, tell them to check private message
     * @param token from header
     * @param req.body.receiverName
     * @param req.body.body.content
     */
    module.create = function (req, res) {
        console.log("Running create message ... ")
        var message = new Message();

        try {
            var decodedToken = new tokenUtils().getDecodedToken(req);
            message.senderName = decodedToken.username;
            message.receiverName = req.body.receiverName;
            message.content = req.body.content;
            message.subject = req.body.subject;

            message.save(function (err, createdMessage) {
                if (err) {
                    res.status(400).send("Encounter error when create message:" + err);
                    return;
                }
                console.log("Successfully created message from " + decodedToken.username + " to " + req.body.receiverName)
                //send email based on the message content
                var mailOptions =
                {
                    from: '"no-reply@airpodslost.com" <contact@airpodslost.com>', //sender address
                    to: 'jiachen.duan@gmail.com',  // receiver
                    subject: req.body.subject, //subject line
                    text: req.body.content,
                    html: '<b>'+req.body.content+'</b>'
                }

                try{
                    new mailUtils().sendEmail(mailOptions)
                }catch(err){
                    console.log("Encountered error when sending email " + err)
                }

                res.jsonp({message: createdMessage})
            })

        } catch (err) {
            if (err) {
                res.status(400).send("Encounter error when create message:" + err);
                return;
            }
        }
    }
    /**
     *  GET
     *  list all messages
     */
    module.findAll = function (req, res) {
        console.log("Find all messages ... ")
        Message.find(function (err, allMessages) {
            if (err) {
                return res.status(400).send("Encountered errors during finding all messages: " + err)
            }
            res.jsonp(allMessages)
        })
    }
    /**
     *  DELETE
     *  delete message permanently
     *  @param req.body._id
     */
    module.delete = function (req, res) {
        console.log("Deleting message : " + req.body._id)
        Message.count({_id: req.body._id}, function (err, count) {
            if (err) {
                return res.status(400).send("Encountered Errors during deleting message: " + err)
            }
            if (count > 0) {
                Message.remove({_id: req.body._id}, function (err, deletedMessage) {
                    if (err) {
                        return res.status(400).send("Encountered Errors during deleting message: " + err)
                    }
                    console.log("Successfully deleted Message: " + req.body._id)
                    res.jsonp({message: deletedMessage})
                })
            } else {
                return res.status(400).send("Oops... Message " + req.body._id +
                    "does not exist");
            }

        })
    }

    /**
     * POST
     * update the message isRead status into true
     * need token and only receiver can update this field
     * 1. find Message by _id
     * 2. if userName from header is the receiver, then update the isReadStatus
     *    else return error message, only message receiver can update isReadStatus
     *  @param required receiver token insider header
     *  @param req.body._id   message _id
     *
     *  */
    module.updateIsReadStatus = function (req, res) {
        console.log("Update message isRead status for message " + req.body._id)
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            Message.findById(req.body._id
                , function (err, message) {
                    if (err) {
                        return res.status(400).send("Encountered error during updateIsReadStatus " + err);
                    }
                    console.log("Found message: " + message)
                    //when current user is message receiver
                    if (message.receiverName === decoded.username) {
                        console.log("Good, User " + decoded.username + " is receiver!")
                        message.isRead = true;
                        message.save(function (err, updatedMessage) {
                            if (err) {
                                return res.status(400).send("Encountered error during updateIsReadStatus " + err);
                            }
                            res.jsonp(updatedMessage)
                        })
                    } else {
                        return res.status(400).send("Oops ... user " + decoded.username + " in not message receiver," +
                            " only message receiver can update message isRead status...");
                    }
                })
        } catch (err) {
            return res.status(400).send("Encountered error during updating IsReadStatus: " + err)
        }
    }

    /**
     * Method to get the inbox message of a user
     *  1. get username from token
     *  2. find all message that receiver is current username
     * @param require User TOKEN
     */
    module.getInboxMessages = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            console.log("Looking for inbox messages for user " + decoded.username)
            Message.find({
                receiverName: decoded.username
            }).sort({sentDate: -1}).exec(function (err, inboxMessages) {
                if (err) {
                    return res.status(400).send("Encountered error when getting InboxMessage: " + err)
                } else {
                    console.log("successfully got inbox message for user: " + decoded.username)
                    res.jsonp(inboxMessages)
                }

            })
        } catch (err) {
            return res.status(400).send("Encountered error when getting InboxMessage: " + err)
        }
    }

    /**
     * Method to get the sendBox of a user
     *  1. get username from token
     *  2. find all message that sender is current username
     * @param require User TOKEN
     */
    module.getSentboxMessages = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            console.log("Looking for sentBox messages for user " + decoded.username)

            Message.find({
                senderName: decoded.username
            }).sort({sentDate: -1}).exec(function (err, inboxMessages) {
                if (err) {
                    return res.status(400).send("Encountered error when getting SentBox messages: " + err)
                } else {
                    console.log("successfully got sentbox message for user: " + decoded.username)
                    res.jsonp(inboxMessages)
                }
            })
        } catch (err) {
            return res.status(400).send("Encountered error when getting sentBox messages: " + err)
        }
    }

    /**
     * Method to delete message inbox
     * 1. get UserToken
     * 2. find message by req.body_id
     * 3. if the current user is the receiver of the message
     *       if isShowSentBox == false
     *       then remove current message permanently
     *       else
     *         set isShowInBox = false
     *
     * @param require User Token
     * @param req.body._id   // id of message to be deleted
     */
    module.deleteInboxMessage = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            Message.findById(req.body._id, function (err, inboxMessage) {
                if (err) {
                    return res.status(400).send("Encountered error during deleting inbox message: " + err)
                }

                if (inboxMessage.receiverName !== decoded.username) {
                    return res.status(400).send("Oops! user: " + decoded.username + " is not the receiver of this" +
                        " message, only receiver can delete inbox message ")
                }

                if (!inboxMessage.isShowSentbox) {
                    console.log("Permanently deleting the message " + req.body._id)
                    Message.findOneAndRemove(req.body._id, function (err, deletedMessage) {
                        console.log("Successfully permanently deleted mesage: " + req.body._id)
                        res.jsonp({
                            status: "successfully permanently delete message",
                            message: deletedMessage
                        })
                    })
                } else {
                    console.log("Setting false in isShowInbox for message: " + req.body._id)
                    inboxMessage.isShowInbox = false;
                    inboxMessage.save(function (err, updatedInboxMessage) {
                        if (err) {
                            return res.status(400).send("Encountered error during sending setting false in" +
                                " isShowInbox: " + err)
                        }

                        console.log("Successfully set isShowInbox to false for message: " + updatedInboxMessage)
                        res.jsonp(updatedInboxMessage)
                    })
                }
            })
        } catch (err) {
            return res.status(400).send("Encountered error during deleting inbox message: " + err)
        }
    }

    /**
     * Method to delete message from sentBox
     * 1. get UserToken
     * 2. find message by req.body_id
     * 3. if the current user is the sender of the message
     *       if isShowInboxBox == false
     *       then remove current message permanently
     *       else
     *         set isShowSentBox = false
     *
     * @param require User Token
     * @param req.body._id   // id of message to be deleted
     */
    module.deleteSentMessage = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            Message.findById(req.body._id, function (err, inboxMessage) {
                if (err) {
                    return res.status(400).send("Encountered error during deleting sentBox message: " + err)
                }

                if (inboxMessage.senderName !== decoded.username) {
                    return res.status(400).send("Oops! user: " + decoded.username + " is not the senter of this" +
                        " message, only sender can delete sentBOx message ")
                }

                if (!inboxMessage.isShowInbox) {
                    console.log("Permanently deleting the message " + req.body._id)
                    Message.findOneAndRemove(req.body._id, function (err, deletedMessage) {
                        console.log("Successfully permanently deleted mesage: " + req.body._id)
                        res.jsonp({
                            status: "successfully permanently delete message",
                            message: deletedMessage
                        })
                    })
                } else {
                    console.log("Setting false in isShowSentbox for message: " + req.body._id)
                    inboxMessage.isShowSentbox = false;
                    inboxMessage.save(function (err, updatedInboxMessage) {
                        if (err) {
                            return res.status(400).send("Encountered error during sending setting false in" +
                                " isShowSentBox: " + err)
                        }

                        console.log("Successfully set isShowSentBox to false for message: " + updatedInboxMessage)
                        res.jsonp(updatedInboxMessage)
                    })
                }
            })
        } catch (err) {
            return res.status(400).send("Encountered error during deleting SentBox message: " + err)
        }
    }

    return module;
}