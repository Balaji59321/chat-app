import { Avatar, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from '../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './Config/ChatLogic';

const ScrollableChats = ({messages}) => {

    const {user} = ChatState();

    function stringAvatar(name) {
        if(name.split(" ").length > 1){
          return {
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`.toUpperCase(),
          };
        }
        return {
          children: `${name.split(' ')[0][0].toUpperCase()}`,
        };
    }

  return (
    <ScrollableFeed>
        {messages && messages.map((m,i) => <Box sx={{display: "flex"}} key={m._id} px={3}>
            {(isSameSender(messages,m,i,user._id) || isLastMessage(messages,i,user._id)) && 
            <Tooltip title={m.sender.name}>
                <Avatar {...stringAvatar(m.sender.name)} />
            </Tooltip>}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
        </Box>)}
    </ScrollableFeed>
  )
}

export default ScrollableChats