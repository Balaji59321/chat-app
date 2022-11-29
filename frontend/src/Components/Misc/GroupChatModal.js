import { Box, Button, Chip, CircularProgress, Modal, TextField, Typography } from '@mui/material'
import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
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


const GroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [groupChatName,setGroupChatName] = useState("");
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false)
    const [renameLoading,setRenameLoading] = useState(false)

    const {user,selectedChat,setSelectedChat} = ChatState();

    const handleDelete = async (user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id === user.id){
            window.alert("Only Admins can remove someone");
            return;
        }

        const config = {
            headers : {
              Authorization : `Bearer ${user.token}`
            }
        }

        try{
            setLoading(true);
            let {data} = await axios.put("http://localhost:5001/api/chat/groupremove",{
                chatId: selectedChat._id,
                userId: user1._id
            },config)

            await user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            await setFetchAgain(!fetchAgain);
            fetchMessages();
        }
        catch(error){
            window.alert("Group removal failed",error);
        }
        setLoading(false);
    }

    const handleAddUser = async (user1) => {
        if(selectedChat.users.find(ele => ele._id === user1._id)){
            window.alert("User already exists in the Group");
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            window.alert("Only Admins can add someone");
            return;
        }

        const config = {
            headers : {
              Authorization : `Bearer ${user.token}`
            }
        }

        try{
            setLoading(true);
            let {data} = await axios.put("http://localhost:5001/api/chat/groupadd",{
                chatId: selectedChat._id,
                userId: user1._id
            },config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        }
        catch(error){
            window.alert("Group addition failed",error);
        }
        setLoading(false);
    }

    const handleRename = async () => {
        if(!setGroupChatName) return;

        const config = {
            headers : {
              Authorization : `Bearer ${user.token}`
            }
        }
        
        try{
            setRenameLoading(true);
            let {data} = await axios.put("http://localhost:5001/api/chat/rename",{
                chatId: selectedChat._id,
                chatName: groupChatName
            },config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        }
        catch(error){
            window.alert("Group Rename Failed",error);
        }
        setRenameLoading(false);
        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        await setSearch(query);
        if(!query) return;
        
        const config = {
            headers : {
              Authorization : `Bearer ${user.token}`
            }
          }
      
          try{
              setLoading(true);
              const {data} = await axios.get(`http://localhost:5001/api/user?search=${search}`,config);
              await setSearchResult(data);
          }
          catch(Error){
              window.alert("Error Occured");
          }
          setLoading(false);
    }

  return (
    <>
    <VisibilityIcon onClick={() => handleOpen()} />
    <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Group Chat
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selectedChat.chatName}
          </Typography>
          <Typography>
            {selectedChat.users.map(ele => <Chip
                label={ele.name}
                sx={{backgroundColor: "#ccc",color:"#111",fontWeight: 700}}
                onDelete={() => handleDelete(ele)}
              />)}
          </Typography>
          <Box sx={{display: "flex",gap: "10px"}} p={2}>
            <TextField id="outlined-basic" label="Chat Name" variant="outlined" onChange={(e) => setGroupChatName(e.target.value)} />
            <Button variant='contained' onClick={() => handleRename()}>Update</Button>
          </Box>
          <Box sx={{display: "flex",gap: "10px"}} p={2}>
            <TextField id="outlined-basic" label="Add User to Group" variant="outlined" onChange={(e) => handleSearch(e.target.value)} />
          </Box>
          {loading ? <CircularProgress /> : 
            searchResult?.map(user => <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />)
          }
          <Button onClick={() => handleDelete(user)} variant='contained'>Leave Group</Button>
        </Box>
      </Modal>
    </>
  )
}

export default GroupChatModal