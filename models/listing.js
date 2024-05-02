const mongoose = require('mongoose');
const review=require("./review")
// const imgSchema = new mongoose.Schema({
//     filename: {type:String,
//  default:"no file name"   },
//  url:{type: String,
//     default:"https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJhbCUyMCUyMGhvdXNlJTIwaW1nfGVufDB8fDB8fHww",
//         set:(v)=>v===""?"https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmF0dXJhbCUyMCUyMGhvdXNlJTIwaW1nfGVufDB8fDB8fHww":v},
// });
const listingSchema=new mongoose.Schema({
    title:
    {type:String,
        required:true},
    location:String,
    image: {
        // type: String,
        // default:
        //   "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        // set: (v) =>
        //   v === ""
        //     ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        //     : v,
        url:String,
        filename:String
      },
    // image:imgSchema,    
    price:Number,
    description:String,
    country:String,
    reviews:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"review"
    }],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    category:{
      type:String,
     
      enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Beach","HouseBoat"]
    },
    geometry:{
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        default:"Point",
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
await review.deleteMany({_id:{$in:listing.reviews}})}
})

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;