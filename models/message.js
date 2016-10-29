/**
 * Created by jiachen duan on 9/13/16.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema


/**
 receiverName: name of message receiver | required | string
 senderName: name of message sender     | required | string
 isShowInBox: true means receiver does not delete this message | required, default true | boolean
 isShowSentBox: true means sender does not delete this message | required, default true | boolean
 content:  content of the message, 200 character   | required | string
 isRead: if the message has been read by receiver  | required | string
 date:  date of the message sent out, default today's Date | required | string
 **/

var message = new Schema(
    {
        receiverName: {type: String, required: true},
        senderName: {type: String, required: true},
        isShowInbox: {type: Boolean, required: true, default: true},
        isShowSentbox: {type: Boolean, required: true, default: true},
        content: {type: String, required: true, max: 200},
        subject: {type: String, required: true, max: 200,default:'Someone contact you from AirpodsLost'},
        isRead: {type: Boolean, required: true, default: false},
        sentDate: {type: Date, default: Date.now}
    }
)


module.exports = mongoose.model('Message', message)