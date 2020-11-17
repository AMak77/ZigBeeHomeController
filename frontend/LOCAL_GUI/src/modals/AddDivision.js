import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, TextField, Button, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';


const useStyles = makeStyles((theme) => ({
    center: {
        // paddingTop: 20,
        textAlign: "center"
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
}))


const CustomizedIconButton = withStyles({
    root:{
        float: "right",
        top: 15,
        right: 20,
        background: "#2d2d2e",
        opacity: 0.7,
        color: '#fff',
        // border: "0px",
        marginLeft: 20,
        '&:hover': {
            backgroundColor: '#fff',
            color: '#000'
        },
    }
})(Button)

export default function AddDivision(props){
    const socket = props.socket;

    const classes = useStyles();

    const [open, setOpen] = useState(false);

    const [buttonStatus, setButtonStatus] = useState(true);

    const [newDivision, setNewDivision] = useState('');

    useEffect(() => {
        if(newDivision){
            setButtonStatus(false);
        } else {
            setButtonStatus(true);
        }
    },[newDivision])

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    function Division(event){
        setNewDivision(event.target.value);
    }

    function AddDivision(){
        socket.emit("NewDivision", {name: newDivision});
        setNewDivision('');
        setOpen(false);
    }

    const body = (
        <div className={classes.center}>
            <Typography>Set the name of new division..</Typography>
            <TextField id="new-division" label="Write here.." value={newDivision} onChange={Division}/>
        </div>
    )

    return(
        <div>
            <CustomizedIconButton
                    size="small"
                    onClick={handleOpen}
                    startIcon={<AddCircleIcon/>}
                >
                    Add Division
            </CustomizedIconButton>
            {/* <button type="button" onClick={handleOpen}>
                Open Modal
            </button> */}
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={'paper'}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <DialogTitle id="scroll-dialog-title">Add Division</DialogTitle>
                <DialogContent dividers>
                    {body}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        disabled={buttonStatus}
                        onClick={AddDivision}
                        color="primary"
                    >
                                Submit
                            </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}