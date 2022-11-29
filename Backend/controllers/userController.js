const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const generateToken = require("./../utils");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req,res,next) => {
    const {name,email,password,pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the fields");
    }

    const useExists = await User.findOne({email});
    
    if(useExists){
        res.status(400);
        throw new Error("Email Already Exists");
    }

    const user = await User.create({
        name,email,password,pic
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("User Creation Failed");
    }
})

const authUser = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body;
 
    const user = await User.findOne({email});

    console.log(user.password,password)

    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
})

const allUsers = asyncHandler(async (req,res,next)=> {
   const key = req.query.search ? {
    $or: [
        { name : {$regex: req.query.search, $options: "i" }},
        { email : {$regex: req.query.search, $options: "i" }}
    ]
   } : {};

   const users = await User.find(key).find({ _id: { $ne: req.user._id } });
   res.send(users);
})

module.exports= {
    registerUser,authUser,allUsers
}