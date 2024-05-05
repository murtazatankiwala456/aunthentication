import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const saltRounds = 10;

import md5 from "md5";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.LOCAL_HOST);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser.save();
    res.render("secrets.ejs");
  });
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const findUser = await User.findOne({ email: username });
    if (findUser) {
      bcrypt.compare(password, findUser.password, (err, result) => {
        if (result === true) {
          res.render("secrets.ejs");
        } else {
          res.send("Incorrect credentials!");
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
