import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    center: {
        textAlign: "center"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}))

export default function EditDevice(props) {

    const socket = props.socket;
  
    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const [name, setName] = useState('');
    const [buttonStatus, setButtonStatus] = useState(true);

    const handleOpen = () => {
        setOpen(true);
    }

    useEffect(() => {
        if(name){
            setButtonStatus(false);
        } else {
            setButtonStatus(true);
        }
    },[name])


    const handleClose = () => {
        setOpen(false)
    }

    const body = (
        <div className={classes.center}>
            <Typography>The old name of this device is {props.name}.</Typography>
            <TextField id="edit-device" style={{paddingTop: 10}} placeholder="Write new name here.." value={name} onChange={e => setName(e.target.value)}/>
        </div>
    )
  
    function EditDevice() {
        socket.emit("EditDevice", {old_name: props.name, name: name});
        handleClose();
    }
  
    return(
        <>
            <Button variant="contained" color="primary" size="small" onClick={handleOpen}>
                Edit
            </Button>
            {/* <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 1000,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transisiton-modal-title">Edit Device</h2>
                        <form onSubmit={SubmitDevice} className={classes.root}>
                            <FormGroup>
                                <FormLabel>The old name of this device is {props.name}.</FormLabel>
                                <TextField id="standard-basic" label="Write new one here..." />
                                <Button variant="contained" color="primary" type="submit">
                                    Submit
                                </Button>
                            </FormGroup>
                        </form>
                    </div>
                </Fade>
            </Modal> */}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Edit name of the device</DialogTitle>
                <DialogContent dividers>
                    {body}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        disabled={buttonStatus}
                        onClick={EditDevice}
                        color="primary"
                    >
                                Submit
                        </Button>
                </DialogActions>
            </Dialog>
        </>
    )
  }