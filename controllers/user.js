const user=require("../models/user");
const passport =require("passport")
module.exports.rendersignup=(req,res)=>{
    res.render("user/signup")
}
module.exports.signup=async(req,res)=>{
    try{
        let {username,password,email}=req.body;
        const newUser=await new user({email,username})
    //     const registeruser=await user.register(newUser,password);
    //     console.log(registeruser);
    //     req.login(registeruser,(err)=>{
    //         if(err){
    //          return   next(err);
    //         }
    //     })
    //     req.flash("success","Welcome to Wanderlust!")
    //     res.redirect("/listing")
              //or login alternative
    user.register(newUser,password)
    .then(function(registereduser){
        passport.authenticate("local")(req,res,function(){
            res.redirect("/listing");
        })
    })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    } 
}
module.exports.renderlogin=(req,res)=>{
    res.render("user/login");
    }
module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wanderlust ,you are know logged In")
    // res.redirect("req.session.redirecturl");  //pr passport dikkat dega vo session ko reset kr dega ek br agr tumne login authenticate kr liaa ,isliye hm local variable me save kra lege
let Redirecturl=res.locals.redirecturl ||"/listing"//agr koi direct login kre to
    res.redirect(Redirecturl)
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return   next(err);
        }
        req.flash("success","you are logged out from Wanderlust!");
        res.redirect("/listing")
    })
}