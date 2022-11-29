import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, ImageList, ImageListItem, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';

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

const ProfileModal = ({data,children}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
  return (
    <div>
        <Button onClick={() => handleOpen()}>{children ? children : <VisibilityIcon />}</Button>
        <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Profile Details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {data.email}
          </Typography>
          <Typography>
            {data.name}
          </Typography>
        <img
            src={data.pic}
            alt={"profile_picture"}
            loading="lazy"
            width={100}
            height={100}
        />
        </Box>
      </Modal>
    </div>
  )
}

export default ProfileModal