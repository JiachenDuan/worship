module.exports = function (app, express) {

    var module = {};
    var User = require('../models/user'),
        jwt = require('jwt-simple'),
        config = require('../config/property')
    const tokenUtils = require('../utils/tokenUtils')


    /**
     * POST
     * Method to create user
     * @param req.body.username
     * @param req.body.email
     * @param req.body.password

     */
    module.create = function (req, res) {
        console.log("Running create user ... ")
        var user = new User();

        /**
         var User = new Schema(
         {
                 username:{ type : String , unique : true, required : true, dropDups: true },
                 password:String,
                 email: { type : String , unique : true, required : true, dropDups: true },
                 token: String,
                 address: {
                   zipcode: String,
                   street: String,`
                   city: String,
                   state: String,
                   country:String
                 },
                 loc:{
                     type: String,
                     coordinates:[]
                 }

              }
         );
         **/
        try {

            user.username = req.body.username,
                user.email = req.body.email,
                user.password = req.body.password

            //TODO: add other attribute here
            user.save(function (err, createdUser) {
                if (err) {
                    res.status(400).send(err);
                    return;
                }
                console.log("Successfully created user: " + user.username)
                res.jsonp({message: user})
            })

        } catch (err) {
            if (err) {
                res.status(400).send(err);
                return;
            }
        }

    }

    //find user by username
    /**
     * GET
     * Find user by userName
     * @param required User TOKEN from Header
     */
    module.findUserByName = function (req, res) {

            try {
                var decoded = new tokenUtils().getDecodedToken(req);

                User.findOne({
                    username: decoded.username
                }, function (err, user) {
                    if (err) {
                        return res.status(400).send({
                            success: false,
                            msg: 'Encountered error during find user by name: ' + err
                        });
                    }

                    if (!user) {
                        return res.status(400).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                        res.jsonp(user);
                    }
                });
            } catch (err) {
               return res.status(400).send("Token is wrong, sign in again");
            }
    }

    /**
     * GET
     * Find all user, this is only used by admin to check all users
     * @param req
     * @param res
     */
    module.findAll = function (req, res) {
        console.log("Running find all user ... ")
        User.find(function (err, allusers) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.jsonp(allusers)
        })
    }
    //delete user by userName
    /**
     * DELETE
     * delete user by userName
     * @param require user TOKEN
     */
    module.delete = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            console.log("Deleting user " + decoded.username)
            /**
             If userName exist, delete,
             otherwise throw error username does not exist
             **/
            User.count({username: decoded.username}, function (err, count) {
                if (err) {
                    return res.status(400).send("Encountered error during Deleting User: " + err);
                }
                if (count > 0) {
                    User.remove({username: decoded.username}, function (err, deletedUser) {
                        if (err) {
                            return res.status(400).send(err);
                        }
                        console.log("Successfully deleted user " + decoded.username)
                        res.jsonp({message: deletedUser});
                    })
                } else {
                    return res.status(400).send("Oops... Username " + decoded.username +
                        "does not exist");
                }
            })
        } catch (err) {
            return res.status(400).send("Encountered error during delete user :" + err)
        }

    }


    /**
     * GET
     * verify user
     * req.query.confirmation_token
     * @param req
     * @param res
     */
   module.verifyUser = function(req,res) {
     try {
         var decoded = new tokenUtils().decodeVerificationToken(req);
         User.findOne({
             username: decoded.username
         }, function (err, user) {
             if (err) {
                 return res.status(400).send({
                     success: false,
                     msg: 'Encountered error during find user by name: ' + err
                 });
             }

             if (!user) {
                 return res.status(400).send({success: false, msg: 'User verification failed. No user found for' +
                 ' given token ... '});
             } else {
                 //make sure user is not already active and also token does not pass the 24 hours expiration
                 if(user.active == true) {
                     return res.status(400).send("Oops user " + user.username +  " is already be activated ... ")
                 }
                 if(new tokenUtils().isTokenExpired(decoded)){
                     return res.status(400).send("Verification token is expired, get a new verification token ")
                 }
                 //change user active into true
                 user.active = true;
                 user.save(function (err, activedUser) {
                     if (err) {
                         res.status(400).send("Encountered error during activate user :" + decoded.username + " with" +
                             " error :" + err);
                         return;
                     }
                     console.log("Successfully activated user: " + user.username)
                     res.jsonp({message: activedUser})
                 })


             }
         });
     }catch(err){
         return res.status(400).send("Encountered error during verifying user " + err)
     }
   }
    /**
     * GET
     * genereate verification token for user
     * TODO: only for testing, need to be removed
     * @param req
     * @param res
     */
   module.genereateVerificationToken = function (req, res) {
       var username = req.query.username;
       var token = new tokenUtils().generateVerificationToken(username);
       res.status(200).send(token)
   }

    /**
     * POST
     * authenticate (login )method, check if user's username and password are correct
     * if yes, create jwt token and sent back to front end
     * @param req.body.username
     * @param req.body.password
     */
    module.authenticate = function (req, res) {
        User.findOne({
                username: req.body.username
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    res.status(400).send('Authentication failed. User not found.')
                } else {
                    console.log("found user : " + user)
                    // check if password matches
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (isMatch && !err) {
                            //make sure user active is true, then pass authenticate,
                            //otherwise ask your to open email and click verification link
                            if(user.active==true){
                                //if user is found and password is right create a token
                                var token = jwt.encode(user, config.secret);
                                // return the information including token as JSON
                                res.jsonp({token: 'JWT ' + token})
                            }else{
                                res.status(400).send('Email is not verified, please go to your email and click the' +
                                    ' verification link...')
                            }
                        } else {
                            res.status(400).send('Authentication failed. Wrong password.')

                        }

                    })
                }
            }
        )
    }


    return module;
}