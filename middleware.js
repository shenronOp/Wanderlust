const Listing=require("./models/listing");
const ExpressError=require('./utils/ExpressError');
const {listingSchema, reviewSchema}=require('./schema')
const Review=require('./models/review');
module.exports.isLoggedIn=(action)=>{
    return (req, res, next)=>{
        if(!req.isAuthenticated()){
            req.flash("error", `You must be logged in to ${action}`)
            if(req.method==='GET')req.session.redirectUrl=req.originalUrl;
            //console.log(req.session.goTo);

            return res.redirect("/login");
        }
        next();
    }
}

module.exports.saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req, res, next)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(req.user && !listing.owner._id.equals(req.user._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing=(req, res, next)=>{
    const {error}=listingSchema.validate(req.body);
    
    if(error){
        const errMsgs=error.details.map(err=>err.message).join(",");
        throw new ExpressError(400, errMsgs);
    }
    else next();
}

module.exports.validateReview=(req, res, next)=>{
    const {error}=reviewSchema.validate(req.body);
    
    if(error){
        const errMsgs=error.details.map(err=>err.message).join(",");
        return next(new ExpressError(400, errMsgs));
    }
    else next();
}

module.exports.isReviewAuthor=async (req, res, next)=>{
    let {id, reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error", "You are not the author of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}