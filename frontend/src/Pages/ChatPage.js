import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import MyChats from './../Components/MyChats';
import ChatBox from '../Components/Misc/ChatBox';
import SideDrawer from '../Components/Misc/SideDrawer';
import { ChatState } from '../Context/ChatProvider';

const ChatPage = () => {
  const {user} = ChatState();
  const [fetchAgain,setFetchAgain] = useState(false);

  return (
    <div>
      {user && <SideDrawer />}
      <Box sx={{display: "flex",justifyContent: "space-between",width: "100%",height: "91.5vh"}}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage;