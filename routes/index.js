var express = require('express'),
    router = express.Router(),
    users = require('./users')(),
    business = require('./business')(),
    messages=require('./messages')();


router.use(function (req, res, next) {

    console.log('Incomming request... '); // do logging
    //to reslove CROSS domain problem
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next() //is inside validateToken();

});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// +++ user +++
router.post('/users',users.create)
router.get('/users',users.findAll)
router.get('/users/userbyname',users.findUserByName)
router.delete('/users',users.delete)
router.post('/users/login',users.authenticate)
// +++ verify user +++
router.get('/verify/',users.verifyUser)
router.get('/verify/generateVerificationToken',users.genereateVerificationToken) //for testing purpose


// +++ message +++
router.post('/messages',messages.create)
router.get('/messages',messages.findAll) //for testing purpose
router.delete('/messages',messages.delete) // for testing purpose
router.post('/messages/updateIsReadStatus',messages.updateIsReadStatus)
router.get('/messages/getInboxMessages',messages.getInboxMessages)
router.get('/messages/getSentboxMessages',messages.getSentboxMessages)
router.post('/messages/deleteInboxMessage',messages.deleteInboxMessage)
router.post('/messages/deleteSentMessage',messages.deleteSentMessage)

// +++ mail +++
router.get('/mail',messages.sendMail)

// +++ business +++
router.post('/business',business.create)
router.post('/business/findBusinessNearBy',business.findBusinessNearBy)
router.get('/business/findUserBusiness',business.findUserBusiness)
router.post('/business/updateBusiness',business.updateBusiness)
router.post('/business/closeBusiness',business.closeBusiness)



module.exports = router;
