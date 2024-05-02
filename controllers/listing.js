const { cloudinary } = require("../cloudconfig");
const Listing=require("../models/listing")
 const mbxgeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
 const maptoken=process.env.MAP_TOKEN;
 const geocodingclient=mbxgeocoding({accessToken:maptoken})
module.exports.index=async (req,res)=>{
    const alllisting= await  Listing.find({});
        res.render("listing/index.ejs",{alllisting});
    }



    ////////////////////////////////////////////////////////////////////////////////////
    module.exports.index2=async (req,res)=>{
      const name=req.params.name;
const  alllisting=await Listing.find({category: name})
if(!alllisting.length){
  req.flash("error","Listing category you are looking is not available!");
  res.redirect("/listing");
}
else{
  res.render("listing/index.ejs",{alllisting});
}

      }
///////////////////////////////////////////////////////////////////////////////////
module.exports.index3=async (req,res)=>{
  let location=req.body.Destination
const  alllisting=await Listing.find({location: location})
if(!alllisting.length){
req.flash("error","Listing category you are looking is not available!");
res.redirect("/listing");
}
else{
  res.render("listing/index.ejs",{alllisting});
}
  }

module.exports.rendernewform=(req,res)=>{
    //       console.log(req.user)//by default req me user ki information hoti he
    //       if(!req.isAuthenticated()){
    // req.flash("error","you must be logged In to create listing")
    // return res.redirect("/login");
    //       }
            res.render("listing/new.ejs");
        }
module.exports.showlisting=async (req,res)=>{
    const {id}=req.params;//to tumhe line  8 likhni hogi
    const listing= await  Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error","Listing you are looking does not exist!");
      res.redirect("/listing");
    }

    console.log(listing);
        res.render("listing/show.ejs",{listing});
    }
module.exports.createlisting=async (req,res,next)=>{
    // let {title,description,price,location,country}=req.body;
    // or
// const result=listingschema.validate(req.body);
// if(result.error){
//   throw new ExpressError(400,result.error)
// }
    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid data for listing")
    // }
    // console.log(result);
  let coordinate= await geocodingclient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send();
 
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"..",filename);
    const newlisting=new Listing(req.body.listing);
    // newlisting.category=req.body.listing.category;
    // console.log(req.user);
    // console.log("rrrrrr")
    newlisting.owner=req.user._id;
    newlisting.image={url,filename}
    newlisting.geometry=coordinate.body.features[0].geometry;
    let savedlisting=await newlisting.save();
    console.log(savedlisting);
    req.flash("success","New Listing Created!")
    res.redirect("/listing");
  }
module.exports.editform=async (req,res)=>{
    const {id}=req.params;//to tumhe line  8 likhni hogi
    const listing= await  Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you are looking does not exist!");
      res.redirect("/listing");
    }
   let originalurl=  listing.image.url;
   originalurl=originalurl.replace("/upload","/upload/w_400,h_300")
    res.render("listing/edit.ejs",{listing,originalurl})
  }
module.exports.updatelisting=async (req,res)=>{
    const {id}=req.params;//to tumhe line  8 likhni hogi
    // if(!req.body.listing){
    //   throw new ExpressError(400,"send valid listing")
    // }
    //authorization line 79-83
    // let listing=await Listing.findById(id)
    // if(!listing.owner._id.equals(res.locals.currentuser._id)){
    //   req.flash("error","you don't have permission to edit");
    // return  res.redirect(`/listing/${id}`);
    // }
let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
if(typeof req.file!=="undefined"){
  let url=req.file.path;
let filename=req.file.filename;
listing.image={url,filename};
await listing.save();
}

req.flash("success","Listing Updated ")
    res.redirect(`/listing/${id}`);
  }
module.exports.deletelisting=async (req,res)=>{
    const {id}=req.params;//to tumhe line  8 likhni hogi
 let deleteddata=await Listing.findByIdAndDelete(id);
 let deleteurl=deleteddata.image.filename;
//  console.log(deleteddata);
 await cloudinary.uploader.destroy(deleteurl);
// await  cloudinary.uploader.destroy('delete', function(result) { console.log(result) });

 console.log(deleteddata);
 req.flash("success","listing deleted ")
    res.redirect(`/listing`);
  }