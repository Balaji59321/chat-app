const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const Chat = require("./../models/chatModel");
const Message = require("./../models/messsageModel");

const sendMessage = asyncHandler(async (req,res,next) => {
    const {chatId,content} = req.body;

    if(!chatId || !content){
        res.status(400);
        throw new Error("Please pass all the fields")
    }

    var message = {
        sender: req.user._id,
        content:  content,
        chat:  chatId
    }

    try{
        var message = await Message.create(message);
        message = await message.populate("sender","name pic")
        message = await message.populate("chat")
    
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message
        })

        res.json(message);
    }
    catch(err){
        res.status(400);
        throw new Error(err);
    }
})

const allMessages = asyncHandler(async (req,res,next) => {
    try{
        const messages = await Message.find({chat: req.params.chatId})
            .populate("sender","name email pic").populate("chat");

        res.json(messages);
    }
    catch(error){
        res.status(400);
        throw new Error("Unable to retrieve Chats");
    }
})

module.exports = {
    sendMessage,allMessages
}
