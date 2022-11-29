const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

// -------- deployment

const __dirname1 = path.resolve();
console.log(__dirname1);
if(process.env.NODE_ENV === 'production'){
    // console.log(path.join(__dirname1, './frontend/build'));
    app.use(express.static(path.join(__dirname1,"/frontend/build")));

    app.get("*",(req,res) => {
        res.sendFile(path.join(__dirname1, "/frontend/build/index.html"));
    })

} else {
    app.get("/",(req,res,next) => {
        res.send("Hello user");
    })
}

// --------

app.use("*",(req,res) => {
    res.status(404).send({
        message: "Something went wrong.Please Try Again"
    })
})

const server = app.listen(process.env.PORT || 3010,() => {
    console.log("Server Started on 3010".red.underline)
})

const io = require("socket.io")(server,{
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3001",
    }
});

io.on("connection",(socket) => {
    console.log("Connected to Socket Io successfully");
    
    socket.on("setup",(userData) => {
        socket.join(userData._id);
        socket.emit("Connected");
    })

    socket.on("join chat",(room) => {
        // creates a room in socket
        socket.join(room);
        console.log("User Join Room",room);
    })

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message received", newMessageRecieved);
        });
      });
})