import React, { useContext, useState } from 'react';
import {Avatar, Button, CircularProgress, Divider, Drawer, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Tooltip, Typography} from '@mui/material'
import { Box } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {
  // Side Bar State
  const {user,setSelectedChat,chat,setChats} = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();

  // Profile state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOutHandler = () => {
    setAnchorEl(null);
    localStorage.removeItem("user");
    history.push('/');
  }

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

  const [state, setState] = React.useState(false);

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(prev => !prev);
  };

  const buttonHandler = async (e) => {
    e.stopPropagation();
    setLoading(true);

    const config = {
      headers : {
        Authorization : `Bearer ${user.token}`
      }
    }

    if(search.trim().length === 0){
      window.alert("Please enter something in Search");
      return;
    }

    try{
        const {data} = await axios.get(`https://chat-app-qw9o.onrender.com/api/user?search=${search}`,config);
        setLoading(false);
        setSearchResult(data);
    }
    catch(Error){
        window.alert("Error Occured");
    }
  
  }

  const accessChat = async (userId) => {
      try{
        setLoadingChat(true);
        const {data} = await axios.post("https://chat-app-qw9o.onrender.com/api/chat",{userId},{headers: {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${user.token}`
        }});

        if(!chat.find(c => c._id === data._id)) setChats([data,...chat])
        setState(false);
        setSelectedChat(data);
        setLoadingChat(false);
      }
      catch(Error){
          window.alert('Something went wrong on chat creation');
          setLoadingChat(false);
      }
  }

  const list = () => {
    return <Box
      sx={{ width: 300,display: "flex",alignItems: "center",flexDirection: "column",gap:4 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      py={2}
      px={1}
    >
      <Typography variant='h6'>Search Users</Typography>
      <Box sx={{display: "flex",gap: 1}} pt={2}>
        <TextField id="standard-basic" label="Search for Users" variant="outlined" value={search} onClick={(e) => e.stopPropagation()} onChange={(e) => {setSearch(e.target.value)}} />
        <Button variant= 'contained' onClick={(e) => buttonHandler(e)}>Go</Button>
      </Box>
      {!loading && searchResult.length === 0 && <span style={{marginTop: "10px"}}>No Results</span>}
      {loading ? <ChatLoading /> : (searchResult.map(user => {
          return <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => accessChat(user._id)}
          />
      }))}
      {loadingChat && <CircularProgress color="secondary" />}
    </Box>
  }

  return (
    <>
    <Box sx={{width :"100%"}}>
      <Box sx={{display: "flex",justifyContent: 'space-between',alignItems: "center",backgroundColor: "#fff",overflow: "hidden"}} py={1} px={2}>
        <Tooltip title='Search Users to Chat'>
          <Button variant='text' onClick={() => setState(true)}>
            <SearchIcon />
            <Typography variant='h6' sx={{textTransform: "capitalize",display: {xs: "none",md: "block"}}}>Search Users</Typography>
          </Button>
        </Tooltip>

        <Typography variant='h5' sx={{textTransform:"Uppercase"}}>Connectify</Typography>

        <Box sx={{display: "flex",gap:"10px",alignItems:"center"}}>
          {/* <NotificationsIcon fontSize='medium'/> */}
          <Button sx={{textTransform: "capitalize",fontSize: 18}} onClick={handleClick}><Avatar {...stringAvatar(user.name)} /></Button>
          <Menu id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}>
              <ProfileModal data={user} >
                  <MenuItem onClick={handleClose}style={{textTransform: "capitalize",color: "#111"}}>My Profile</MenuItem>
              </ProfileModal>
              <Divider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>

    {state && <React.Fragment>
      <Drawer
        anchor={'left'}
        open={state}
        onClose={() => toggleDrawer(false)}
      >
         {list()}
      </Drawer>
    </React.Fragment>}

    </>
  )
}

export default SideDrawer