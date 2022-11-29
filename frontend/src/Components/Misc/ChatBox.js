import { Box } from '@mui/system';
import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const {selectedChat} = ChatState();

  return (
    <Box sx={{display: {xs: selectedChat ? "flex": "none",md: "flex"},width: {xs: "100%",md: "68%",backgroundColor: "#fff",height: "inherit"}}}>
      <SingleChat fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox