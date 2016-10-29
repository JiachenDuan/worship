/**
 * Created by jiachen duan on 9/13/16.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema


/**
 username: username who create business | required | string
 action: user's action, like buy, sell, donate, none | required and default is none | string
 price: user selling price | required if action is Not None | string
 leftorright: user want sell or buy or donate their left or right or both AirPods | required if action is not None | string
 condition:  user need to rate his/her the condition of their airPods, 1-10 |  required if action is not None | Number
 postDate: when user post their business default is now |  required if action is not None | number
 description: user can add more description inside description |  required if action is not None | number
 address:
 zipcode: zip code |    | string
 street:  street address |  | string
 city: city name |   | string
 state: state name |     | string
 country: country name |   | string,
 loc:
 type: point, may add others later | required | string |
 cordinates: longtitde and latitude |  | array of string, the order must be in longitude then latitude
 **/

var business = new Schema(
    {
        username: {type: String, required: true},
        action: {type: String, required:true,lowercase: true},
        price: {type: String,required:true},
        leftorright: {type: String, required:true,lowercase: true},
        condition: {type: Number, required:true},
        status:{type:Boolean,default:true},
        postDate: {type: Date, required:true,default: Date.now},
        description:{type:String, max:600},
        loc: {
            type: {type: String, default: 'Point'},
            coordinates: [Number],
        },
        address: {
            zipcode: String,
            street: String,
            city: String,
            state: String,
            country: String
        },
    }
)

business.index({loc: '2dsphere'})

module.exports = mongoose.model('Business', business)