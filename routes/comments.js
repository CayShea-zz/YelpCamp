var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// +++++++++++++++++
// COMMENTS ROUTES
// +++++++++++++++++

//GET route for New comment form. isLoggedIn argument (function below)
        //checks if user is logged in before taking to "comments/new"
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
     Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//POST newly created comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
    //lookup campground with ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
        
        //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("sucess","Thanks for the comment!");
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


//EDIT Route for comments 
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentAuthorization, function(req,res){
    Comment.findById(req.params.comment_id, function (err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            //pass ID for campground and comment
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});        
        }
    });
});


//COMMENT Update Route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuthorization, function(req,res){
    //findByIdAndUpdate takes three parameters: id to find by, the data to update, and the callback
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");   
        } else {
            req.flash("success", "Updated comment!");
            //redirect to campground page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentAuthorization, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function (err){
        if (err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Comment go bye-bye");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;