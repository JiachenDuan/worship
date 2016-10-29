var express = require('express'),
    mongoose = require('mongoose'),
    configDB = require('./config/database.js'),
    jwt = require('jwt-simple'),
    http = require('http'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport');

    


var app = express();

//app.models = require('./models');

app.set('port', (process.env.PORT || 5000));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(process.env.PWD + '/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
process.env.PWD = process.cwd()
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(express.static(path.join(process.env.PWD , 'FrontEndProject/angular-seed-master/app')));
app.use(express.static(path.join(process.env.PWD, 'bower')));
console.log("PWD: " + process.env.PWD)

// set default index.html
app.get('/',function(req,res){
    res.sendFile('index.html');
    //It will find and locate index.html from View or Scripts
});

//routes
//var routes = require('./routes/index')(app);
var routes = require('./routes/index');
app.use('/', routes);
//app.use('/users', users);

//Use the passport package
app.use(passport.initialize());


// error handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('WTF!!! Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Connect to DB
mongoose.connect(configDB.url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
    console.log("DB connected successful...")
});

//+++ Routes +++
//require('./routes/routes.js')(app, express);

//withouth it, it will always listen to 3000
app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
})

module.exports = app;

