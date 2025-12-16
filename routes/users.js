const express=require("express");
const Router=express.Router({mergeParams:true});
const User=require("../models/user");
const { wrapAsync } = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware");

const userController=require('../controllers/users');

Router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

Router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", 
        {failureRedirect: '/login', failureFlash:true}), 
        userController.login)


Router.get("/logout", userController.logout);
module.exports=Router;