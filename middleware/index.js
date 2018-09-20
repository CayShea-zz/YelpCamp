//==================
//ALL MIDDLEWARE HERE
//==================
var Campground = require("../models/campground");
var Comment = require("../models/comment");



var middlewareObject = {};

middlewareObject.checkCampAuthorization = function (req,res, next){
        //is user logged in?
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
            if (err){
                req.flash("Oop, you've wandered to far off the trail!");
                res.redirect("back");
            } else {
                //Does user own campground? (cannot use '===' because one item is objext, the other is a string. Use method below instead)
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Hey now, that isn't yours to edit");
                    res.redirect("back");
                }
            }
        })} else {
            req.flash("error", "You need to log in first");
            res.redirect("back");
        }    
    };

middlewareObject.checkCommentAuthorization = function (req, res, next){
        //is user logged in?
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                req.flash("error", "Something went wrong. Please try another page");
                console.log(err);
                res.redirect("back");
            } else {
                //Does user own campground? (cannot use '===' because one item is objext, the other is a string. Use method below instead)
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Sorry, that belongs to another user");
                    res.redirect("back");
                }
            }
        })} else {
            req.flash("error", "Oop, you need to log in first");
            res.redirect("back");
        }    
    };

middlewareObject.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
        }
        //handling login logic: add next step on the /login ROUTE use is being redirected to
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    };


module.exports = middlewareObject;





