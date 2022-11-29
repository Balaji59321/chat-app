import { Button, Typography } from '@mui/material';
import { Box, color } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from './Config/ChatLogic';
import GroupChatModel from './Misc/GroupChatModel';

const MyChats = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser] = useState();
  const {selectedChat,user,setSelectedChat,chat,setChats} = ChatState();

  console.log(loggedUser);

  const fetchChat = async (userId) => {
    try{
      const config = {
        headers : {
          "Content-type": "application/json",
          Authorization : `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get(`http://localhost:5001/api/chat`,config)
      await setChats(data);
    }
    catch(Error){
        window.alert('Something went wrong on chat creation');
    }
    }

  useEffect(() => {
    console.log("I am called");
    const fetchUser = async () => {
      await setLoggedUser(JSON.parse(localStorage.getItem("user")));
      await fetchChat();
    }
    fetchUser();
  },[fetchAgain])

  return (
    <Box sx={{display: {xs: selectedChat ? "none" : "flex",md: "flex"},width: {xs: "100%",md: "32%"},backgroundColor: "#eee",textAlign:"center",flexDirection: "column"}}>
      <Box sx={{display: "flex",justifyContent:"space-between",alignItems:"flex-start",fontSize: "25px"}} p={2}>
          My Chats
          <GroupChatModel>
          <Button variant='contained'>
            New Group Chat
          </Button>
          </GroupChatModel>
      </Box>
      <Box sx={{display:"flex",flexDirection:"column",overflow: "hidden"}} p={2}>
        {chat ? <Box>
            {chat.map(cha => <Box onClick={async () => await setSelectedChat(cha)} sx={{color: selectedChat === cha ? "white" : "black",backgroundColor: selectedChat === cha ? "blue" : "e8e8e8"}} key={cha._id} p={0.5}>
                <Typography sx={{textTransform: "capitalize",cursor: "pointer"}}>{!cha.isGroupChat ? getSender(user,cha.users) : cha.chatName}</Typography>
              </Box>
            )}
        </Box> : <ChatLoading />}
      </Box>
    </Box>
  )
}

export default MyChats