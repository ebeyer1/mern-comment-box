//server.js
'use strict';

//first we import our dependencies…
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./src/model/comments');
var User = require('./src/model/users');

//and create our instances
var app = express();
//now we should configure the API to use bodyParser and look for 
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(__dirname + '/build/'));

//db config
var mongooseOptions = {
  useMongoClient: true  
};
var mongoUri = process.env.MONGODB_URI || 'mongodb://test_user:password@ds117495.mlab.com:17495/mern-comment-box';
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

// adding the /users route to our /api router
router.route('/users')
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) res.send(err);
            // responds with a json object of our database users.
            res.json(users);
        });
    })
    .post(function(req,res) {
        var newUser = new User();
        newUser.counter = 0;

        newUser.save(function(err) {
            if (err) res.send(err); 

            res.json(newUser);
        });
    });

router.route('/users/:user_id')
    .get(function (req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
            
            res.json(user);
        });
    })
    // for now this updates the counter by 1. eventually should be its own route based on what is being trained
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
            
            user.counter += 1;
            
            user.save(function(err) {
                if (err) res.send(err);
                
                res.json(user);
            })
        })
    })
    .delete(function(req, res) {
        User.remove({ _id: req.params.user_id }, function(err, comment) {
            if (err) res.send(err);
            res.json({ message: 'Comment has been deleted' });
        });
    });

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('api running on port ' + port);
});