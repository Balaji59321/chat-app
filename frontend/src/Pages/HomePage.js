import React, { useEffect } from 'react';
import {Box, Tab, Tabs, Typography} from "@mui/material"
import PropTypes from 'prop-types';
import Login from '../Components/Authentication/Login';
import SignUp from '../Components/Authentication/SignUp';
import { useNavigate } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const HomePage = () => {
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if(user) history("/chats");
  },[history])

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{display: "flex",alignItems: "center",justifyContent:"center",height: "100vh",flexDirection:"column"}}>
      <Box sx={{width: {xs: "90%",md: "30%"},display: "flex",alignItems:"center",flexDirection:"column",backgroundColor: "#ddd"}}>
        <Typography sx={{backgroundColor: "orange",color: "black",width: "200px"}} p={3}>Chat App</Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Login" {...a11yProps(0)} />
          <Tab label="Sign-Up" {...a11yProps(1)} />
        </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Login />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SignUp />
        </TabPanel>
        </Box>
    </Box>
  )
}

export default HomePage