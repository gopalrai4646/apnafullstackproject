const express=require("express");
const router=express.Router();
const wrapasync=require("../utile/wrapasync.js");
const {isLoggedin,isOwner,validationlisting}=require("../views/middleware.js");
const ListingController=require("../controllers/listing.js")
const multer=require("multer");
const{storage}=require("../cloudconfig.js")
// const upload=multer({dest:"uploads/"})
const upload=multer({storage})
router
    .route("/")
    .get(wrapasync(ListingController.index))
    .post(isLoggedin,upload.single("listing[image]"),validationlisting,wrapasync(ListingController.createlisting))

    router
       .route("/category/:name")
      .get(wrapasync(ListingController.index2))
      router
      .route("/Destination")
     .post(wrapasync(ListingController.index3))
 //new route
 router.get("/new",isLoggedin,ListingController.rendernewform)
// router.get("listingfilter",wrapasync(ListingController.index2))
// app.get('/listings/:category',wrapasync( async (req, res) => {
//    const category = req.params.category; // Get category from URL params
//    try {
//      // Query Mongoose model to retrieve listings based on category
//      const filteredListings = await Listing.find({ category: category });
//      res.json(filteredListings); // Send filtered listings as JSON response
//    } catch (error) {
//      console.error('Error fetching filtered listings:', error);
//      res.status(500).json({ error: 'Internal server error' });
//    }
//  }));
router
.route("/:id")
.get(wrapasync(ListingController.showlisting))
.put(isLoggedin,isOwner,upload.single("listing[image]"),validationlisting,wrapasync(ListingController.updatelisting))
.delete(isLoggedin,isOwner,wrapasync(ListingController.deletelisting))



//edit route
      router.get("/:id/edit",isLoggedin,isOwner,wrapasync(ListingController.editform)
      )
  module.exports=router;