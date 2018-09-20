var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// =======
// ROUTES
// =======
router.get("/", function(req, res){
    res.render("landing");
});

//=========
// AUTH Routes 
// ========

//REGISTER form
router.get("/register", function(req,res){
    res.render("register");
});
//handle regiser/sign up logic
router.post("/register", function (req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", "Oopsy Daisy! " + err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
        req.flash("success", "Welcome to the club! Are your hiking boots ready " + user.username + "?");    
            res.redirect("/campgrounds");
        });
    });
});

//LOGIN Route
//GET route for login form
router.get("/login", function(req,res){
    // Message var being passed in is second part of logic for flash. 
    res.render("login");
});
    
//POST route to handle logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req,res){
});


//LOGOUT Route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "See you soon!");
    res.redirect("/campgrounds");
});



module.exports = router;