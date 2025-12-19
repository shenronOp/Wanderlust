const mongoose = require('mongoose');
const Review=require('./review');

const listingSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: {
        type: String
    },
    image: {
        type:{
            url:String,
            filename:String,
        },
        default:{
            url:"/images/defaultImg.jpg",
            filename:"Nil"
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
    },

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const listing = mongoose.model("listing", listingSchema);



module.exports = listing;