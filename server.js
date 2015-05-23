// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// require body-parser
var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({
  extended: true
}));

// require mongoose and create the mongoose variable
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose123');
var UserSchema = new mongoose.Schema({
 name: String,
 age: Number
})
var User = mongoose.model('User', UserSchema);
// This is the route that we already have in our server.js
// When the user presses the submit button on index.ejs it should send a post request to '/users' and in this route we should add the user to the database and then redirect to the root route (index view).
app.post('/users', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var user = new User({name: req.body.name, age: req.body.age});
  // try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  user.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/result');
      // res.render('result', {users: users_array});
    }
  })
});
// the root route -- we want to get all of the users from the database and then render the index view passing it all of the users
app.get('/', function(req, res) {
  User.find({}, function(err, records) {
    // this is the method that finds all of the users from the database
    // notice how the first parameter is the options for what to find and the second is the callback function that has an error (if any) and all of the users
    // keep in mind that everything you want to do AFTER you get the users from the database must happen inside of this callback for it to be synchronous 
    // Make sure you handle the case for when there is an error as well as the case for when there is no error
  res.render('index', {users: records})
  })
})
app.get('/result', function(req, res) {
  User.find({}, function(err, records) {
    // this is the method that finds all of the users from the database
    // notice how the first parameter is the options for what to find and the second is the callback function that has an error (if any) and all of the users
    // keep in mind that everything you want to do AFTER you get the users from the database must happen inside of this callback for it to be synchronous 
    // Make sure you handle the case for when there is an error as well as the case for when there is no error
  res.render('result', {users: records})
  })
});

// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
// app.get('/', function(req, res) {
//  res.render("index");
// });

// app.post('/result', function(req, res){
// 			console.log("Post data", req.body);
// 	    var users_array = [{
// 	    	name: req.body.name, 
//         location: req.body.location, 
//         language: req.body.language, 
//         comment: req.body.comment 
//         }];
//     res.render('result', {users: users_array});
// });


// tell the express app to listen on port 8000
app.listen(8080, function() {
 console.log("listening on port 8080");
});