const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const accessChat = asyncHandler(async (req,res,next)=> {
    const {userId} = req.body;
    if(!userId){
        throw new Error("User not found");
        return res.status(400);
    }

    var isChat = await Chat.find({
        isGroupChat : false,
        $and : [{users: {$in : req.user._id }},{users : {$in : userId }}]
    })

    isChat = await User.populate(isChat, {
        path : "latestMessage.sender",
        select: "name pic email"
    })
    console.log(isChat);

    if(isChat.length > 0){
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: "false",
            users: [req.user._id,userId]
        }

        try{
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password");
            res.status(200).send(fullChat);
        }
        catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }

    
})

const fetchChat = asyncHandler(async (req,res, next) => {

    console.log(req.user);
    try{
        const user = await Chat.find({users : {$elemMatch: {$eq: req.user._id}}})
        .populate("users","-password")
        .populate("latestMessage")
        .sort({updatedAt : -1})

        // user = await User.populate(user, {
        //     path : "latestMessage.sender",
        //     select: "name pic email"
        // })
        
        res.status(200).send(user);
    }
    catch(Error){
        res.status(400);
        throw new Error("Chat not found");
    }
})

const createGroupChat = asyncHandler(async (req,res,next) => {
    if(!req.body.users || !req.body.name){
        res.status(400).send("Please Fill all the Fields");
    }

    var users = JSON.parse(req.body.users);
    console.log(users.length);

    if(users.length < 2){
        res.status(400);
        throw new Error("Group Chat creation is not possoble")
    }
    
    let temp = users.filter(ele => ele._id);
    users.push(req.user);

    try{
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user
      })
      const fullGroupChat = await Chat.findOne({_id: groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
      console.log("fullchat",fullGroupChat);
      res.status(200).send(fullGroupChat);
    }catch(Error){
        res.status(400).send("Group Chat Creation Failed");
    }
})

const renameGroup = asyncHandler(async (req,res,next) => {
    const {chatId,chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,{
        chatName:chatName
    },{
        runValidators : true,
        new : true
    }).populate("users","-password").populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(400).send("Rename Group Failed");
    }else{
        res.status(200).send(updatedChat);
    }
})

const addToGroup =  asyncHandler(async (req,res,next) => {
    const {chatId,userId} = req.body;
    
    const add = await Chat.findByIdAndUpdate(chatId,{
        $push : { users: userId}
    },{runValidators:  true})
    .populate("users","-passwprd")
    .populate("groupAdmin", "-password");

    if(!add){
        res.status(400);
        throw new Error("Chat not Found");
    }
    else{
        res.status(200).send(add);
    }
})

const removeFromGroup = asyncHandler(async (req,res,next) => {
    const {userId,chatId} = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull : { users: userId}
    },{runValidators:  true})
    .populate("users","-passwprd")
    .populate("groupAdmin", "-password");

    if(!removed){
        res.status(400);
        throw new Error("Chat not Found");
    }
    else{
        res.status(200).send(removed);
    }
})

module.exports= { accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup }