import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@mui/system';
import { CircularProgress, FormControl, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSender,getSenderFull } from '../Config/ChatLogic';
import ProfileModal from './ProfileModal';
import GroupChatModal from './GroupChatModal';
import axios from 'axios';
import ScrollableChats from '../ScrollableChats';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5001";
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setNewMessage] = useState();
    const [socketConnected,setSocketConnected] = useState(false);

    const {user,selectedChat,setSelectedChat} = ChatState();

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connection", () => setSocketConnected(true));
    },[])

    const fetchMessages = async (event) => {
        if(!selectedChat) return;

        try{
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            }
            setLoading(true);
            const {data} = await axios.get(`http://localhost:5001/api/message/${selectedChat._id}`,config);
            setMessages(data);
            socket.emit("join chat",selectedChat._id);
        }
        catch(error){
            window.alert("Unable to send new chat message");
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat])

    useEffect(() => {
        socket.on("message received",(newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                // Give Notification
            }
            else{
                setMessages([...messages,newMessageReceived]);
            }
        })
    })

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage){
            try{
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                }
                setNewMessage("");
                const {data} = await axios.post(`http://localhost:5001/api/message`,{
                    content: newMessage,
                    chatId: selectedChat._id
                },config);
                socket.emit("new message",data);
                setMessages([...messages,data]);
            }
            catch(error){
                window.alert("Unable to send new chat message");
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    }

    return (
        <Box sx={{width: "100%",height: "inherit",border: "1px solid #ccc"}}>{selectedChat ? 
            <>
                <Box sx={{display: "flex",justifyContent:"space-between",alignItems:"center"}} p={{xs: 1,md: 2}}>
                    <ArrowBackIcon sx={{display: {xs: "flex",md: "none"}}} onClick={() => setSelectedChat("")} />
                    {
                        !selectedChat.isGroupChat ? <>
                            {getSender(user,selectedChat.users)}
                            <ProfileModal data={user} />
                        </> : 
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <GroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                        </>
                    }
                </Box>
                <Box sx={{display: "flex",width: "100%",height: "88%"}}>
                    <Box sx={{display: "flex",flexDirection: "column",justifyContent:"flex-end",backgroundColor: "#e8e8e1",overflowY: "hidden",width: "100%",height: "100%"}} px={{xs: 1.5,md: 2}} py={2}>
                        {loading ? <CircularProgress sx={{alignSelf: "center",margin: "auto"}} /> : (
                            <Box sx={{display: "flex",flexDirection: "column",overflowY: "scroll",scrollbarWidth: "none"}}>
                                <ScrollableChats messages={messages} />
                            </Box>
                        )}
                        <Box m={2}>
                            <FormControl onKeyDown={sendMessage} sx={{width: "100%"}} p={2}>
                                <TextField id="standard-basic" label="Enter a Message" variant="outlined" sx={{width: "100%",backgroundColor: "#eee"}} value={newMessage} onChange={typingHandler} />
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </> : 
            <Box sx={{display: "flex",justifyContent:"center",alignItems: "center",width: "100%",height: "100%"}}>
                <Typography variant='h6'>Click on a User to Start Chatting</Typography>
            </Box>
        }</Box>
    )
}

SingleChat.propTypes = {}

export default SingleChat;