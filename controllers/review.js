const Listing=require("../models/listing");
const review=require("../models/review");

module.exports.createreview=async(req,res)=>{//child route
    let listing=await Listing.findById(req.params.id)
    let newreview=await review(req.body.review );
    newreview.author=req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("review saved");
    req.flash("success","New review created ")
    res.redirect(`/listing/${listing._id}`)
      }
module.exports.destroy=async(req,res)=>{//child route
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await review.findByIdAndDelete(reviewid);
    req.flash("success","review Deleted ")
    res.redirect(`/listing/${id}`)
  }