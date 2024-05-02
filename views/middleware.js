const Listing=require("../models/listing")
const Review=require("../models/review.js")
const {listingschema,reviewschema}=require("../schemajoi.js")
const ExpressError=require("../utile/ExpresssError.js");
module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect kispe kre save krana loga
        req.session.redirecturl=req.originalUrl
        // console.log(req.path,"..",req.originalUrl)
        req.flash("error","you must be logged In to create listing")
        return res.redirect("/login");
    }
    next();
}
module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    const {id}=req.params;
    let listing=await Listing.findById(id)
        if(!listing.owner._id.equals(res.locals.currentuser._id)){
          req.flash("error","you don't have this permission as you are not owner of this listing");
        return  res.redirect(`/listing/${id}`);
        }
    next();
}
module.exports.validationlisting=(req,res,next)=>{
    const {error}=listingschema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  }
  else{next();}
  }
module.exports.validationreview=(req,res,next)=>{
    const {error}=reviewschema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  }
  else{next();}
  }
  module.exports.isreviewAuthor=async(req,res,next)=>{
    const {id,reviewid}=req.params;
    let review=await Review.findById(reviewid)
        if(!review.author.equals(res.locals.currentuser._id)){
          req.flash("error","you don't have this permission as you are not author of this review");
        return  res.redirect(`/listing/${id}`);
        }
    next();
}