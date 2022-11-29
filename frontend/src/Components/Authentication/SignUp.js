import { Button, FormControl, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import axios from "axios";
import {useHistory} from "react-router-dom"

const SignUp =  () => {

  const [name,setName] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [confirmPassword,setConfirmPassword] = useState();
  const [pic,setPic] = useState();
  const [loading,setLoading] = useState(false);
  const history = useHistory();

  const submitHandler = async () => {
   if(!name || !email || !password){
    window.alert("Please Enter all the fields");
    return;
   }

   if(password !== confirmPassword){
    window.alert("Please enter the matching passwords");
    return;
   }

   try{
      setLoading(true);
      let {data} = await axios.post("http://localhost:5001/api/user",{name,email,password});
      console.log(data);
      localStorage.setItem("user",JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
   }
   catch(error){
    window.alert("Something went wrong .please try again");
   }
  }

  return (
    <Box sx={{display: "flex",flexDirection:"column",gap: 2,width: {xs: "100%",md:"400px"}}}>
        <FormControl id='first-name' required>
            <TextField id="outlined-basic" label={name ? name : "Name"} variant="outlined" onChange={(e) => setName(e.target.value)} value={name} />
        </FormControl>
        <FormControl id='email' required>
            <TextField id="outlined-basic" label={email ? email : "Email"} variant="outlined" onChange={(e) => setEmail(e.target.value)} value={email}/>
        </FormControl>
        <FormControl id='password' required>
            <TextField id="outlined-basic" type='password' label={password ? "" : "Password"} variant="outlined" onChange={(e) => setPassword(e.target.value)} value={password}/>
        </FormControl>
        <FormControl id='confirm password' required>
            <TextField id="outlined-basic"  type='password'  variant="outlined" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>
        </FormControl>
        {/* <FormControl id='picture' required>
            <TextField id="outlined-basic" type='file' accept='image/*' variant="outlined" onChange={(e) => postDetails(e.target.files[0])} value={pic}/>
        </FormControl> */}
       
          <Button variant='contained' loading={loading} onClick={() => submitHandler()}>Login</Button>
          <Button variant='contained' onClick={() => {setEmail("guest@gmail.com");setPassword("123456");}}>Get Guest User Credentials</Button>
    </Box>
  )
}

export default SignUp