import { Button, Chip, CircularProgress, Modal, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#eee',
    border: '2px solid #000',
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    p: 4,
  };


const GroupChatModel = ({children}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [groupChatName,setGroupChatName] = useState("");
    const [selectedUsers,setSelectedUsers] = useState([]);
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false)

    const {user,chat,setChats} = ChatState();

    const handleSearch = async (query) => {
        await setSearch(query);
        if(!query){
            return;
        }

        const config = {
          headers : {
            Authorization : `Bearer ${user.token}`
          }
        }
    
        try{
            setLoading(true);
            const {data} = await axios.get(`http://localhost:5001/api/user?search=${query}`,config);
            setLoading(false);
            setSearchResult(data);
        }
        catch(Error){
            window.alert("Error Occured");
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers){
            window.alert("Please Fill all the Fields");
            return;
        }

        const config = {
          headers: {
            "Authorization" : `Bearer ${user.token}`
        }}

        try{
            const {data} = await axios.post("http://localhost:5001/api/chat/group",{
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id))
            },config)

            setChats(prev => [data,...prev]);
            window.alert("Chat added Successfully");
        }
        catch(error){
            window.alert("Something went wrong");
        }
        setOpen(false);
    }

    const handleDelete = async (user) => {
        await setSelectedUsers(prev => prev.filter(users => users !== user))
    }

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            window.alert("User Already Added");
            return;
        }
        setSelectedUsers(prev => [...prev,userToAdd]);
    }
  return (
    <>
      <span onClick={() => handleOpen()}>{children}</span>
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Group Chat
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2,display: "flex",flexDirection:"column" }}>
            <TextField id="outlined-basic" label={"Group Chat Name"} variant="outlined" onChange={(e) => setGroupChatName(e.target.value)} value={groupChatName} style={{margin: "10px"}}/>
            <TextField id="outlined-basic" label={"Add Users e.g John"} variant="outlined" onChange={(e) => handleSearch(e.target.value)} style={{margin: "10px"}}/>
            <Box sx={{display: "flex"}}>{selectedUsers.map(user => 
                <Chip
                label={user.name}
                // onClick={handleClick}
                sx={{backgroundColor: "#ccc",color:"#111",fontWeight: 700}}
                onDelete={() => handleDelete(user)}
              />)}
            </Box>
            {loading ? <CircularProgress color="secondary" /> : searchResult.slice(0,4).map(user => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>)}
          </Box>
          <Button onClick={() => handleSubmit()} variant='contained'>Create Chat</Button>
        </Box>
      </Modal>
    </>
  )
}

export default GroupChatModel