const express=require('express');
const app=express();
const PORT=8000;
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
require('dotenv').config();

const ExpressError=require('./utils/ExpressError');

const listingRouter=require("./routes/listings");
const reviewRouter=require("./routes/reviews");
const userRouter=require("./routes/users");

const cookieParser=require("cookie-parser");
const session=require("express-session");
const MongoStore=require('connect-mongo').default;
const flash=require('connect-flash');

const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const {isLoggedIn}=require("./middleware");
//-------------------------------------


const mongoose=require('mongoose');
const { name } = require('ejs');
const MONGO_URL=process.env.MONGO_URL;
async function main (URL){
    await mongoose.connect(URL);
}

main(MONGO_URL, {
    tls: true,
    tlsAllowInvalidCertificates: true
})
    .then(()=>console.log("connected to DB"))
    .catch(()=>console.log("db error"));

//-----------------------------------

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.resolve('./public')));
app.use(cookieParser());

const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SESSION_SECRET
    },
    touchAfter:24*60*60
});

store.on("error", (err)=>{
    console.log("ERROR in Mongo Session Store", err)
})
const sessionOptions={
    store,
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires: Date.now()+3*24*60*60*1000,
        maxAge:3*24*60*60*1000,
        httpOnly:true,
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//-----------------middleware---------------------

app.use((req, res, next)=>{
    res.locals.success=req.flash("success") || [];
    res.locals.error=req.flash("error") || [];
    res.locals.currentUser=req.user;
    next();
})






app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.get("/", (req, res)=>{
    res.redirect("/listings");
})

//error MWs---------------------------------------------    
app.use((req, res, next)=>{
    next(new ExpressError(404, "Page not Found"));
})

app.use((err, req, res, next)=>{
    //console.log(err);
    const {status=500, message="Internal Server Error"}=err;
    return res.status(status).render("listings/error", {message})
})


app.listen(PORT, ()=>{
    console.log(`SERVER RUNNING AT PORT ${PORT}`)
});




