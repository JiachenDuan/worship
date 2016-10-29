module.exports = function (app, express) {

    var module = {};
    var User = require('../models/user'),
        jwt = require('jwt-simple'),
        config = require('../config/property'),
        Business = require('../models/business')
    const tokenUtils = require('../utils/tokenUtils')

    /**
     *
     {
      "action":"buy",
      "price" : "20",
      "leftorright":"right",
      "condition":3,
      "description":"I want to buy a left pair of AirPods",
      "type":"Point",
      "coordinates":[12,11]
 }
     )
     * @param req
     * @param res
     * @returns {*}
     */

    module.create = function (req, res) {

        try {
            var decoded = new tokenUtils().getDecodedToken(req);

            User.findOne({
                username: decoded.username
            }, function (err, user) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        msg: 'Encountered error during find user by name: ' + err
                    });
                }
                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {

                    try {
                        console.log("Creating business for user " + decoded.username)
                        var business = new Business();
                        business.username = decoded.username;
                        business.action = req.body.action,
                            business.price = req.body.price,
                            business.leftorright = req.body.leftorright,
                            business.condition = req.body.condition,
                            business.postDate = Date.now(),
                            business.address = {
                                zipcode: req.body.zipcode,
                                street: req.body.street,
                                city: req.body.city,
                                state: req.body.state,
                                country: req.body.country
                            }

                        business.description = req.body.description,
                            business.loc = {
                                type: req.body.type,
                                coordinates: req.body.coordinates
                            }
                        business.save(function (err, createdBusiness) {
                            if (err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log("Successfully created business : " + createdBusiness)
                            res.jsonp({message: createdBusiness})
                        })
                    } catch (err) {
                        if (err) {
                            return res.status(400).send("Encountered error during create business : " + err)
                        }
                    }
                }
            });
        } catch (err) {
            return res.status(400).send("Token is wrong, sign in again");
        }
    }
    /**
     * POST
     * {
 	   "_id":"57f084d9ab1ace32d7e5f22d",
       "action":"sell",
       "price" : "40",
       "leftorright":"right",
       "condition":5,
       "description":"Hello, I want to buy a left pair of AirPods",
       "type":"Point",
       "coordinates":[12,13],
       "zipcode":"95126"
       }
     * update business
     * @param require user token inside header
     * @param res
     * @returns {*}
     */

    module.updateBusiness = function(req,res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            console.log("updating business for user " + decoded.username)
            Business.findOne({username: decoded.username, _id: req.body._id},function (err, business) {
                if(err)
                {
                    return res.status(400).send("Encountered error finding business by _id " + req.body._id + " "+ err)
                }
                if(!business)
                {
                    return res.status(400).send("No business found with  _id " + req.body._id + " for user: " +
                        " "+ decoded.username)

                }
                // business.username = decoded.username;
                business.action = req.body.action,
                    business.price = req.body.price,
                    business.leftorright = req.body.leftorright,
                    business.condition = req.body.condition,
                    business.postDate = Date.now(),
                    business.address = {
                        zipcode: req.body.zipcode,
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country
                    }

                business.description = req.body.description,
                    business.loc = {
                        type: req.body.type,
                        coordinates: req.body.coordinates
                    }

                business.save(function (err, updatedBusiness) {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log("Successfully updated business : " + updatedBusiness)
                    res.jsonp({message: updatedBusiness})
                })
            })

        } catch (err) {
            if (err) {
                return res.status(400).send("Encountered error during udpate business " + err)
            }
        }
    }
    module.updateBusinessOld = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            console.log("updating business for user " + decoded.username)
            Business.findOneAndUpdate({username: decoded.username, _id: req.body._id}, {
                $set: {
                    action: req.body.action,
                    price: req.body.price,
                    leftorright: req.body.leftorright,
                    condition: req.body.condition,
                    description: req.body.description,
                    postDate: Date.now(),
                    address: {
                        zipcode: req.body.zipcode,
                        street: req.body.street,
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country
                    },
                    loc: {
                        type: "Point",
                        coordinates: req.body.coordinates
                    }
                }
            }, {new: true}, function (err, updatedBusiness) {
                if (err) {
                    return res.status(400).send("Oops ... can not update business " + err)
                }
                console.log("Successfully updated business for user " + decoded.username)
                res.jsonp({message: updatedBusiness})
            })
        } catch (err) {
            if (err) {
                return res.status(400).send("Encountered error during udpate business " + err)
            }
        }
    }


    /**
     *  {
 	      "_id":"57f084d9ab1ace32d7e5f22d"
        }
     * POST
     * find business and change the status into false
     * business _id
     * @param require user token
     * @param res
     */
    module.closeBusiness = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            console.log("close business for user " + decoded.username)
            Business.findOneAndUpdate({username: decoded.username, _id: req.body._id}, {
                $set: {
                     status:false,
                    postDate: Date.now()
                }
            }, {new: true}, function (err, closeBusiness) {
                if (err) {
                    return res.status(400).send("Oops ... can not close business " + err)
                }
                console.log("Successfully close business for user " + decoded.username)
                res.jsonp({message: closeBusiness})
            })

        } catch (err) {
            if (err) {
                return res.status(400).send("Encountered error during close business: " + err)

            }
        }
    }

    /**
     * GET
     * find all the business from a User
     * @param need user TOKEN
     * @param res
     */
    module.findUserBusiness = function (req, res) {
        try {
            var decoded = new tokenUtils().getDecodedToken(req);
            console.log("Looking for user " + decoded.username + "'s business")
            Business.find({username: decoded.username}, function (err, userBusiness) {
                if (err) {
                    return res.status(400).send("Encountered error during findUserBusiness " + err)
                }
                console.log("successfully find user business " + userBusiness)
                return res.jsonp(userBusiness)
            })
        } catch (err) {
            return res.status(400).send("Encountered error during findUserBusiness " + err)
        }
    }

    /**
     *   HOW to make GEO index work
     *   1. need to delete all the entry with geo entry
     *   2. create 2dsphere index for user schema
     *   3. insert document with correct format geo entry
     *      eg,      loc: {
     *                       type: "Point",
     *                       coordinates: [ 10, -20 ]
     *                    }
     *  notes: only return business with status is true
     * @param req.body.coordinates
     * @param req.body.limit  // how many user retrieve
     * @param req.body.distance  // distance between away from the coordinates by miles
     * @param next
     */
    module.findBusinessNearBy = function (req, res, next) {
        console.log("Looking for nearby business for loc " + req.body.coordinates)
        var limit = req.body.limit || 10;
        // get the max distance or set it to 8 kilometers
        var maxDistantce = req.body.distance || 200;

        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        maxDistantce /= 3963.2;
        // get coordinates [ <longitude> , <latitude> ]


        Business.find({
            status: true,
            loc: {
                $nearSphere: req.body.coordinates,
                $maxDistance: maxDistantce
            }
        }).limit(limit).exec(function (err, nearbyBusiness) {
            if (err) {
                return res.status(400).send("Oops... can not get nearby business for loc  " + req.body.coordinates +
                    " : " + err);
            } else {
                console.log("Successfully found nearby business " + nearbyBusiness + " for loc " + req.body.coordinates)
                res.jsonp(nearbyBusiness)
            }
        })
    }


    return module;
}