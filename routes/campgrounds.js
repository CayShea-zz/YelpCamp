var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");

var options = {
    provier: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
var geocoder = NodeGeocoder(options);

//INDEX ROUTE
router.get("/campgrounds", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function (err, allcampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", 
            {campgrounds: allcampgrounds});
        }
    });
});

//CREATE route
router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var price = req.body.price;
   var description = req.body.description;
  //save var of author info
   var author= {
       id: req.user._id,
       username: req.user.username
   };
  //Google maps
   geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    
 
  //create var for the 'newCampground'
   var newCampground = {name: name, price: price, image:image, description: description, author: author};
  
   // create new campground and save to DB
    Campground.create(newCampground, function(err, newCreated){
        if(err){
          console.log(err);
        } else {
           req.flash("success", "Oooh another campground!");
        //redirect back to /campgrounds page
          res.redirect("/campgrounds");
        }
     });
});

//NEW route
router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});


//SHOW route - detailed page/info about one campground
router.get("/campgrounds/:id", function(req,res){
    //need to get id from campground selected-
    //  using Mongoose tool - findById and to populate the ID for comments- use populat.exec
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // res.render("this will be the SHOW page");
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT Route
router.get("/campgrounds/:id/edit", middleware.checkCampAuthorization, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


//SHOW Route after EDIT with 'put'
router.put("/campgrounds/:id", middleware.checkCampAuthorization, function(req, res){
    //GOOGLE map
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;
    
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           req.flash("success", "Campground has been updated");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DESTROY Route
router.delete("/campgrounds/:id", middleware.checkCampAuthorization, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function (err){
        if (err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground has been removed");
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;
