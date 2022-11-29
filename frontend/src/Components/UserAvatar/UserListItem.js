import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box sx={{display: "flex",gap: 2,justifyContent:"flex-start",border: "1px solid #ddd",backgroundColor: "#eee",cursor: "pointer"}} p={2} m={1} onClick={(e) => {e.stopPropagation();handleFunction();}}>
        <img src={user.pic} alt="chat_picture" width={50} height={50}/>
        <Box>
            <Typography>{user.name}</Typography>
            <Typography>{user.email}</Typography>
        </Box>
    </Box>
  )
}

export default UserListItem