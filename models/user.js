var mongoose = require('mongoose');
Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

/**
 username: user name and unique identifier of user | required | string
 password: user password | required | string | min 6 chacter
 email: user's email | required  | string
 token: token for authorization | TODO: implement it later | string
 **/
var User = new Schema(
    {
        username: {type: String, unique: true, required: true, dropDups: true},
        password: {type: String, unique: true, required: true, dropDups: true},
        email: {type: String, unique: true, required: true, dropDups: true},
        phone: {type: String, unique: true, dropDups: true},
        token: String,
        active: {type: Boolean, default: false}
    }
);

User.index({loc: '2dsphere'})
/**
 hash password before save new user
 **/


User.pre('save', function (next) {
    var user = this;

    //only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    //genereate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err)

        // has the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err)
            //override the cleartext password with hashed one
            user.password = hash;
            next();

        })
    })
})

User.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}


module.exports = mongoose.model('User', User)