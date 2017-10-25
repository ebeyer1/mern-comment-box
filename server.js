//server.js
'use strict';

//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var Comment = require('./src/model/comments');

//and create our instances
var app = express();
//now we should configure the API to use bodyParser and look for 
//JSON data in the request body
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the React app
//app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(__dirname + '/build/'));

//db config
var mongooseOptions = {
  useMongoClient: true  
};
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/beyer-labs';
mongoose.connect(mongoUri, mongooseOptions);

// TODO - maybe we don't need this
//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
//app.use(function(req, res, next) {
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader('Access-Control-Allow-Credentials', 'true');
//    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
//    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//    //and remove cacheing so we get the most recent comments
//    res.setHeader('Cache-Control', 'no-cache');
//    next();
//});

var router = express.Router();

//now we can set the route path & initialize the API
router.get('/', function(req, res) {
    res.json({ message: 'API has been Initialized!'});
});

//adding the /comments route to our /api router
router.route('/comments')
    // retrieve all comments from the database
    .get(function(req, res) {
        //looks at our Comment Schema
        Comment.find(function(err, comments) {
            if (err) res.send(err);
            // responds with a json object of our database comments.
            res.json(comments);
        });
//        res.json({comments: [], msg: 'ze comments'});
    })
    //post new comment to the database
    .post(function(req, res) {
        var comment = new Comment();
        //body parser lets us use the req.body
        comment.author = req.body.author;
        comment.text = req.body.text;
    
        comment.save(function(err) {
           if (err) res.send(err);
            res.json({message: 'Comment successfully added!'});
        });
    });

//Adding a route to a specific comment based on the database ID
router.route('/comments/:comment_id')
    //the put method gives us the chance to update our comment based on
    //the ID passed to the route
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) res.send(err);
            //setting the new author and text to whatever was changed. If
            //nothing was changed we will not alter the field.
            (req.body.author) ? comment.author = req.body.author : null;
            (req.body.text) ? comment.text = req.body.text : null;
            //save comment
            comment.save(function(err) {
                if (err) res.send(err);
                res.json({ message: 'Comment has been updated' });
            });
        });
    })
    //delete method for removing a comment from our database
    .delete(function(req, res) {
        //selects the comment by its ID, then removes it.
        Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
            if (err) res.send(err);
            res.json({ message: 'Comment has been deleted' });
        });
    });

//Use our router configuration when we call /api
app.use('/api', router);

//app.get('/api', (req, res) => {
//    res.json({ message: 'API Initialized!!!'});
//});
//
//app.get('/api/comments', (req, res) => {
//    //looks at our Comment Schema
//    Comment.find(function(err, comments) {
//        if (err) res.send(err);
//        // responds with a json object of our database comments.
//        res.json(comments);
//    });
//});
//
//app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname+'/build/index.html'));
//});

// put all API endpoints under '/api/
//app.get('/api', (req, res) => {
//    res.status(200).json({ message: 'API is initialized!'});
//});
//
//app.get('/api/comments', (req, res) => {
////   Comment.find(function(err, comments) {
////        if (err) res.status(500).json(err);
////        // responds with a json object of our database comments.
////        res.status(200).json(comments);
////    });
//    res.json({comments:[]});
//});

//app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname+'/build/index.html'));
//});

//starts the server and listens for requests
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('api running on port ' + port);
});