const express=require("express");
const router=express.Router({mergeParams:true})
const user=require("../models/user");
const wrapasync = require("../utile/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../views/middleware");
const UserController=require("../controllers/user.js")

router
   .route("/signup")
   .get(UserController.rendersignup)
   .post(wrapasync(UserController.signup))
router
    .route("/login")
    .get(UserController.renderlogin)
    .post(saveredirecturl,
passport.authenticate("local"//strategy konsi he
,{failureRedirect:'/login',//fali hone pe
failureFlash:true//mtlab authentication record krta he
}),
UserController.login)
router.get("/logout",UserController.logout)
module.exports=router;