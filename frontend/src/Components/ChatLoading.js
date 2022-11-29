import { Box, Skeleton } from '@mui/material'
import React from 'react'

const ChatLoading = () => {
  return (
    <Box sx={{display: "flex",flexDirection: "column",gap : 1}}>
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />
        <Skeleton variant="rectangular" width={"100%"} height={40} />    
    </Box>
  )
}

export default ChatLoading