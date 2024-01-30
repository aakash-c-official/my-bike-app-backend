const express = require("express");
const app = express();
const cors = require("cors"); //needed for local server and cliet error ie solve cors error
const mongoose = require("mongoose"); //to connect to mongoose in advance
const User = require("./models/user.model");
const Service= require("./models/service")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
// const UserModel = require("./models/user.model");
require("dotenv").config();
// console.log(process.env)

app.use(express.json()); //middlewares
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "sasdsdasfs";
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// mongoose.connect("mongodb://localhost:27017/bike-database"); //
// mongoose.connect("mongodb+srv://aakashc:YPtoUTaySTxsqJTo@cluster0.3fdbzu7.mongodb.net/bike-db"); //give mongodb link here
mongoose.connect(process.env.MONGO_URL);
// console.log(process.env.MONGO_URL)

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    await User.create({
      role: req.body.role,
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});
app.post("/register", async (req, res) => {
  const { role, username, email, password } = req.body.signupData;
  try {
    const userDoc = await User.create({
      role,
      name: username,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc); // Send a JSON response (replace {} with your response data if needed)
  } catch (err) {
    res.status(422).json(e);
  }
});
app.get("/test", (req, res) => {
  res.json("testjsjsj");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body.signinData;
  console.log(email);
  const userDoc = await User.findOne({ email: email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
          // res.json({token});
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found ");
  }
  // res.json();
});

app.post("/api/login", async (req, res) => {
  console.log(req.body);

  const user = await User.findOne({
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});
app.get("/test", async (req, res) => {
  res.json("test ok");
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { role, name, email, _id } = await User.findOne(userData._id);
      res.json({ role, name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/addservice",(req,res)=>{
  const { token } = req.cookies;
  console.log(req.body)
  const {city,centerName}=req.body.formData;
  const {servicesList}=req.body;
  console.log(servicesList)
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    console.log(userData)
    if (err) throw err;
 const serviceDoc=  await Service.create({
  owner:userData.id,
  city,center:centerName,services:servicesList
})
res.json(serviceDoc)
  });

})

app.get('/allservices',(req,res)=>{
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id}=userData;
    res.json(await Service.find({owner:id}));
  })


})

app.listen(1337, () => {
  console.log("server started");
});
