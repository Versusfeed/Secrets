//jshint esversion:6
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret,encryptedFields:["password"]});

const UserModel = new mongoose.model("User",userSchema);



app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{
  const newUser = new UserModel({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save((err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});

app.post("/login",(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  UserModel.findOne({email:username},(err,foundEmail)=>{
    if(err){
      console.log(err);
    }else{
      if(foundEmail){
        if(foundEmail.password==password){
          res.render("secrets");
        }
      }
    }
  });
});
