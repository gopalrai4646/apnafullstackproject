if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}
console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose = require('mongoose');
var methodOverride = require('method-override')
const path=require("path");
const ejsMate=require("ejs-mate")
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine('ejs',ejsMate)
 app.use(express.urlencoded({extended:true}))
 app.use(methodOverride('_method'))
 app.use(express.static(path.join(__dirname, 'public')))
const Expresssession=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash") 
const wrapasync=require("./utile/wrapasync.js");
const ListingController=require("./controllers/listing.js")
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
const ExpressError=require("./utile/ExpresssError.js");
//  const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const Dburl=process.env.ATLAS_URl;
main()
.then(()=>{
    console.log("server mongo connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(Dburl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const store=MongoStore.create(
  {
    mongoUrl:Dburl,
    crypto:{
      secret:process.env.SECRET, 
    },
    touchAfter:24*3600
  }
)
store.on("error",()=>{
  console.log("ERROr in mongo session store",err)
})
const ExpresssessionOption={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,//7 din ke liye browser pr save
    maxAge:7*24*60*60*1000,
    httpOnly:true//security perpuse cross-scription attects pervent
  }
}
const Passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");
const passport = require("passport");

// app.get("/listingfilter",(req,res)=>{
//   console.log("hi gopal");
//   res.send("rammmmm")
// })

app.use(Expresssession(ExpresssessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser()); 

app.use((req,res,next)=>{
 res.locals.success= req.flash("success");
//  console.log(res.locals.success);
 res.locals.error= req.flash("error");
 res.locals.currentuser=req.user;
 next();
})

// app.get("/demouser",async(req,res)=>{
// let fakeuser=new user({
//   email:"student@gmail.com",
//   username:"delta-student"
// })
// let newRegistereduser=await user.register(fakeuser,"helloworld")//ye user model me fakeuser ko register kra dega with password helloworld or check bhi kr lega ki unique username he ya nhi
//  res.send(newRegistereduser)})
//
app.use("/listing",listingRouter);//parent route
app.use("/listing/:id/review",reviewRouter)//parent route
app.use("/",userRouter);
// app.get("/testlisting",async (req,res)=>{
//     const sampletest=new listing({
//         title:"my new villa",
//         location:"chhipaner",
//         price:1200,
//         descripton:"by the beach",
//         country:"India"
//     })
// await sampletest.save();
// console.log("sample saved");
// res.send("successfully ")
// })
app.get("/",wrapasync(ListingController.index));
app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found"))
})
app.use((err,req,res,next)=>{
  let {status=500,message="somthing went wrong"}=err;
  // res.status(status).send(message)
  res.status(status).render("error.ejs",{err})
})
app.listen(8080,(req,res)=>{
console.log("server is listening at 8080")
})
