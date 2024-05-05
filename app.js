import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";
import encrypt from "mongoose-encryption"


const app = express()
const port = 3000

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']} );

const User = mongoose.model("User", userSchema)

app.get("/", (req,res) =>{
    res.render("home.ejs")
});
app.get("/login", (req,res) =>{
    res.render("login.ejs")
});
app.get("/register", (req,res) =>{
    res. render("register.ejs")
});


app.post("/register", (req,res) =>{
    const newUser = new User({
        email:req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets.ejs")
});

app.post("/login",async (req,res) =>{
    try{
        const username = req.body.username;
        const password = req.body.password

        const findUser =await User.findOne({email: username});
        if(findUser){
            if(findUser.password === password){
                res.render("secrets.ejs") }
        }else{
            res.send("Incorrect crendentials!")
        }
    }catch(error){
        res.send(error,"User not found")

    }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
