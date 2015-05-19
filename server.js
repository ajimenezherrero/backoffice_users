var express = require("express"),
    app     = express(),
    http    = require("http"),
    bodyParser = require('body-parser'),
    server  = http.createServer(app),
    mongoose = require('mongoose');

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.set('port', 3000);
});

app.use(express.static('views'));

app.get('/backoffice', function(req, res) {
    res.sendfile('./views/usersbackoffice.html');});

routes = require('./routes/users')(app);

//DATABASE
mongoose.connect('mongodb://localhost/Examen_Users', function(err, res) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    } else {
        console.log('Connected to Database');
    }
});

//SERVER
server.listen(app.get('port'), function() {
    console.log("Node server running on http://localhost:3000");
});