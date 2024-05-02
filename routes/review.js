const express=require("express");
const router=express.Router({mergeParams:true});//parent route se child route me information lene ke liye
const wrapasync=require("../utile/wrapasync.js");
const {validationreview,isLoggedin,isreviewAuthor}=require("../views/middleware.js")
const ReviewController=require("../controllers/review.js");

  //review post route
  router.post("/",isLoggedin,validationreview,wrapasync(ReviewController.createreview));
//delete review route
    router.delete("/:reviewid",isLoggedin,isreviewAuthor,wrapasync(ReviewController.destroy));
    module.exports=router;