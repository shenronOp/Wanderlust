const Listing=require('../models/listing');


module.exports.index=async(req, res, next)=>{
    const listings=await Listing.find({});
    return res.render("listings/index", {listings});
}

module.exports.renderNewForm=async(req, res)=>{
    //console.log(req.user);
    return res.render("listings/new");
}

module.exports.showListing=async(req, res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    if(!listing){
        req.flash("error", "listing you requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    return res.status(200).render("listings/show", {listing});
}

module.exports.createListing=async(req, res, next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    req.body.owner=req.user._id;
    req.body.image={url, filename};
    const newListing=await Listing.create(req.body);
    console.log(newListing);
    req.flash("success", "New listing created!")
    return res.redirect("/listings");
}


module.exports.renderEditForm=async(req, res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImg=listing.image.url;

    if (originalImg.includes("cloudinary.com")) {
        originalImg = originalImg.replace("/upload", "/upload/w_250");
    }

    else if (originalImg.includes("unsplash.com")) {
        if (!originalImg.includes("&w=")) {
            originalImg += "&w=250";
        }
    }

    listing.image.url=originalImg;
    console.log(listing.image.url);
    return res.render("listings/edit", {listing});
}

module.exports.updateListing=async(req, res)=>{

    if(!req.body)req.flash("error", "Need all details to edit listing")
    if(typeof req.file!=undefined){
        let url=req.file.path;
        let filename=req.file.filename;
        req.body.owner=req.user._id;
        req.body.image={url, filename};
    }    
    const {id}=req.params;
    const updatedlisting=await Listing.findByIdAndUpdate(id, req.body);
    req.flash("success", "successfully updated the listing")
    return res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req, res)=>{
    const {id}=req.params;
    const deletedListing=await Listing.findByIdAndDelete(id);
    console.log("DELETED LISTING:-"+deletedListing);
    req.flash("success", "listing deleted!");
    return res.redirect("/listings");
}