const express=require("express");
const Router=express.Router();
const {wrapAsync}=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {listingSchema}=require('../schema')
const Review=require('../models/review');
const Listing=require('../models/listing');
const {isLoggedIn, isOwner, validateListing}=require("../middleware");
const multer  = require('multer');
const path = require("path");
const {storage}=require('../cloudConfig');

const upload=multer({storage: storage});

const listingController=require('../controllers/listings');
//-------------------------------------------------------------
Router.route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single('image'), validateListing, wrapAsync(listingController.createListing));

Router.get("/new", isLoggedIn("create listings"), wrapAsync(listingController.renderNewForm));  //a form which post request to /lisitngs


Router.get("/:id/edit",isLoggedIn("edit listings"), isOwner, wrapAsync(listingController.renderEditForm))//a form which put req to /listings/:id

//-----show route---------------

Router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn("edit listings"), isOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn("delete listings", `/listings`), isOwner, wrapAsync(listingController.destroyListing))

module.exports=Router;
