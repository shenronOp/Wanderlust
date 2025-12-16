const express=require("express");
const Router=express.Router({mergeParams:true});
const {wrapAsync}=require('../utils/wrapAsync');
const ExpressError=require('../utils/ExpressError');
const {reviewSchema}=require('../schema')
const Review=require('../models/review');
const Listing=require('../models/listing');
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware")



const reviewController=require('../controllers/reviews');


Router.post("/", isLoggedIn("give a review"), validateReview, wrapAsync(reviewController.createReview));

Router.delete("/:reviewId", isLoggedIn("delete this review"), 
isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=Router;