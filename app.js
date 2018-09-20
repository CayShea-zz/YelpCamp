var express =       require ("express"),
    app =           express(),
    bodyParser =    require("body-parser"),
    mongoose=       require("mongoose"),
    passport=       require("passport"),
    LocalStrategy = require("passport-local"),
    Campground =    require("./models/campground"),
    Comment =       require("./models/comment"),
    User =          require("./models/user"),
    SeedDB=         require("./seeds"),
    flash=          require("connect-flash"),
    methodOverride= require("method-override");
    
//add var for ROUTES files
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");


// Best to have 2 DATABASES.
        // First DEVELOPMENT DB. is local DB, for testing and building app
        // Second is external for the deployed app.
        // using environment variables to check which DB to use
// DEV DB:
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
// EXTERNAL DB:
// mongoose.connect("mongodb://CayShea:Cona14@ds111113.mlab.com:11113/yelpcampcs", { useNewUrlParser: true });


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// SeedDB();

//=======
// PASSPORT Configuration
//========
app.use(require("express-session")({
    secret: "I like to camp",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//next lines comes from mongoose- would have to write out if didn't have mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


//middleware to check if user is isLoggedIn
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Middleware
//this function passes to every template:  currentUser AND 'message' var with flash
app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});


//tell App to USE the three routes
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Grab your flannel shirt- it's time to camp!");
});







