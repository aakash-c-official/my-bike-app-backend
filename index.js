const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose"); //to connect to mongoose in advance
const User=require('./models/user.model')
const jwt=require('jsonwebtoken')

app.use(cors());
app.use(express.json());
// mongoose.connect("mongodb://localhost:27017/bike-database"); //
mongoose.connect("mongodb+srv://aakashc:YPtoUTaySTxsqJTo@cluster0.3fdbzu7.mongodb.net/bike-db"); //give mongodb link here

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      role:req.body.role,
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
  
});

app.post("/api/login", async (req, res) => {
  console.log(req.body);

  const user = await User.findOne({
    role:req.body.role,
    email: req.body.email,
    password: req.body.password,
  });
  if(user){
    const token=jwt.sign({
      name:user.name,
      email:user.email,

    },'secret123')
  res.json({ status: "ok" ,user:token});  
  }
  else{
    return res.json({status:'error',user:false})
  }
  
  
});

app.listen(1337, () => {
  console.log("server started");
});
