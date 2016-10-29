/**
 * Created by yishuchen on 9/24/16.
 */

module.exports = function(){
    var config = require('../config/property'),
        jwt = require('jwt-simple'),
        nodemailer = require('nodemailer')

    var module = {};
    /**
     *  create reusable transporter object using the default SMTP transport
     */
    var transporter = nodemailer.createTransport(config.smtpConfig)


    /**
     * method to send email, mailOptions need to follow rules below
     *  var mailOptions =
     *        {
                 from:'"no-reply@airpodslost.com" <contact@airpodslost.com>', //sender address
                 to: 'jiachen.duan@gmail.com',  // receiver
                 subject: 'Hello', //subject line
                 text: 'Hello world', //plaintext body
                 html: '<b>Hellow World</b>'
              }
     * @param mailOptions
     */
    module.sendEmail = function(mailOptions){

        transporter.sendMail(mailOptions,function (err, info) {
            console.log("Sending email to " + mailOptions.to)
            if(err){
                console.log("Encountered error during sending mail: " + err)
            }
            var output = {
                'status': 'Email sent successfully',
                'message': info
            }
            return output
            console.log(output)
        })
    }

    return module;
}


