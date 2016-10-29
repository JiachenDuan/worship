/**
 * Created by Jiachen on 9/13/16.
 */
// function tokenUtils() {
//
// }
//
// tokenUtils.prototype.getToken = function(headers){
//     if (headers && headers.authorization) {
//         var parted = headers.authorization.split(' ');
//         if (parted.length === 2) {
//             return parted[1];
//         } else {
//             return null;
//         }
//     } else {
//         return null;
//     }
// }
//
//
// tokenUtils.prototype.getDecodedToken = function (req, res) {
//     var token = this.getToken(req.headers);
//     if (token) {
//         try{
//             var decoded = jwt.decode(token, config.secret);
//
//             return decoded;
//
//         }catch(err){
//             res.status(400).send("Token is wrong, sign in again");
//             // return;
//         }
//     } else {
//         return res.status(403).send({success: false, msg: 'No token provided.'});
//     }
// }
//
// module.exports = tokenUtils;

module.exports = function(){
    var config = require('../config/property'),
          jwt = require('jwt-simple'),
          nodemailer = require('nodemailer'),
          moment = require('moment')

    var module = {};
    /**
     *  create reusable transporter object using the default SMTP transport
     */
    var transporter = nodemailer.createTransport(config.smtpConfig)


    //get token from header
    module.getToken = function(headers){
        if (headers && headers.authorization) {
            var parted = headers.authorization.split(' ');
            if (parted.length === 2) {
                return parted[1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    /**
     * check header to get token and return decoded object from token
     * if no token or decode failed, will return error
     * this method will be used by all methods requires token
     */
    module.getDecodedToken = function(req) {
        var token = this.getToken(req.headers);
        if (token) {
            try{
                var decoded = jwt.decode(token, config.secret);

                return decoded;

            }catch(err){
                throw new Error("Token is wrong, sign in again");

            }
        } else {
            throw new Error("No token provided or Token format is incorrect");

        }
    }
    /**
     * method to decode verification token
     * @param req
     */
    module.decodeVerificationToken = function(req) {
        var token =  req.query.confirmation_token;

        if(token) {
            try{
                var decoded = jwt.decode(token,config.verification);
                return decoded;
            }catch(err){
                throw new Error("Token is wrong, please pass correct verification token")
            }
        }else{
            throw new Error("Token can not be empty...")
        }
    }
    /**
     * generate verification token for user
     */
    module.generateVerificationToken = function(username) {
        var expires = moment().add(1,'days').valueOf()
        var payload = { username: username, exp: expires}
        var token = jwt.encode(payload, config.verification);
        return token;
    }

    /**
     *  check if the  token is expired or not
     */
   module.isTokenExpired = function(token) {
        var isExpired = true;
        if(token){
            if(token.exp>Date.now()){
                isExpired = false
            }
        }
        return isExpired;
    }




    return module;
}


