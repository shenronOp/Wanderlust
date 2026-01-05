const Listing=require('../models/listing');
const {getCoord}=require('../utils/getCoordinates');
const client=require("../client")

module.exports.index=async(req, res, next)=>{
    const {category}=req.query;
    if(category){
        const redisData=await client.get(`listing:${category}`)
        console.log(redisData)
        if(redisData)return res.render("listings/index", {listings:JSON.parse(redisData), category});
        const listings=await Listing.find({category:category});
        await client.set(`listing:${category}`, JSON.stringify(listings))
        await client.expire(`listing:${category}`, 10)
        return res.render("listings/index", {listings, category});
    }
    const redisListings=await client.get("listings:all")
    console.log(redisListings)
    if(redisListings)return res.render("listings/index", {listings:JSON.parse(redisListings), category:"none"});
    const listings=await Listing.find({});
    await client.set("listings:all", JSON.stringify(listings))
    await client.expire("listings:all", 10)
    return res.render("listings/index", {listings, category:"none"});
}

module.exports.renderNewForm=async(req, res)=>{
    //console.log(req.user);
    return res.render("listings/new");
}

module.exports.showListing=async(req, res)=>{
    let {id}=req.params;
    const redisData=await client.get(`listing:${id}`)
    console.log(redisData)
    if(redisData)return res.status(200).render("listings/show", {listing:JSON.parse(redisData)});

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
    await client.set(`listing:${id}`, JSON.stringify(listing), "EX", 10)
    return res.status(200).render("listings/show", {listing});
}

module.exports.createListing=async(req, res, next)=>{
    
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        req.body.image={url, filename};
    }
    req.body.owner=req.user._id;
    
    req.body.geometry={}
    req.body.geometry.type="Point";
    req.body.geometry.coordinates=Object.values(await getCoord(req.body.location, req.body.country));
    console.log(req.body.geometry.coordinates)
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
    console.log(req.file);
    if(req.file){
        let url=req.file.path;
        let filename=req.file.filename;
        req.body.owner=req.user._id;
        req.body.image={url, filename};
        req.body.geometry={};
        req.body.geometry.type="Point"
        req.body.geometry.coordinates=Object.values(await getCoord(req.body.location, req.body.country));
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