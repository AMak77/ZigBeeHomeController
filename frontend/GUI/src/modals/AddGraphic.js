import React, { useEffect, useState, useRef } from 'react';
import { Dialog, Button, Select, FormControl, MenuItem, InputLabel, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';


const useStyles = makeStyles((theme) => ({
    center: {
        paddingTop: 20,
        textAlign: "center"
    },
    formControl: {
        textAlign:"center",
        margin: theme.spacing(1),
        minWidth: 120,
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

export default function AddGraphic(props){
    const socket = props.socket;

    const classes = useStyles();
    
    const [open, setOpen] = useState(false);

    const [Devices, setDevices] = useState([]);
    const [Data, setData] = useState([]);

    const [device, setDevice] = useState('');
    const [parameter, setParameter] = useState('');
    const [parameters, setParameters] = useState([]);

    const [buttonStatus, setButtonStatus] = useState(true);

    const isCancelled = useRef(false);

    useEffect(() => {
        // socket.emit("GETGRAPHICS");
        socket.emit("GETDEVICES");
        socket.emit("GETMEASUREMENTS");
        // socket.on("Graphics", data => {
        //     if(!isCancelled.current){
        //         setListGraphics(data);
        //     }
        // })
        socket.on("Devices", data => {
            if(!isCancelled.current){
                setDevices(data);
            }
        })
        socket.on("Measurements", data => {
            if(!isCancelled.current){
                setData(data);
            }
        })
        return () => {
            isCancelled.current = true;
        }
    }, [socket])

    useEffect(() => {
        let ObjectParameters = Object.assign({}, ...Data.filter(item => item.device_id === device).splice(0,1))
        let bannedParameters = ['_id','device_id','date','color','__v','linkquality'];
        setParameters(Object.keys(ObjectParameters).filter(item => !bannedParameters.includes(item)))
    },[device, Data])

    useEffect(() => {
        setParameter('');
        setButtonStatus(true);
    }, [device])

    useEffect(() => {
        if(parameter.length > 0){
            setButtonStatus(false);
        }
    },[parameter])


    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    function AddGraphic(event){
        event.preventDefault();
        socket.emit("NewGraphic", {device: device, parameter: parameter});
        setOpen(false);
        // socket.emit("GETGRAPHICS");
    }


    const body = (
        <>
         <form className={classes.center}>
                <FormControl className={classes.formControl}>
                    <InputLabel>Device</InputLabel>
                    <Select 
                        value={device}
                        onChange={e => setDevice(e.target.value)}
                    >
                        {
                            Devices.map(device => device.friendly_name !== 'Coordinator' ? (
                                <MenuItem key={device.ieeeAddr} value={device.ieeeAddr}>
                                    {device.friendly_name}
                                </MenuItem>
                            ) : false)
                        }
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel>Parameter</InputLabel>
                    <Select 
                        value={parameter}
                        onChange={e => setParameter(e.target.value)}
                    >
                        {
                            parameters.map(item => (
                                <MenuItem key={item.toString()} value={item}>
                                    {item}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </form>
        </>
    )

    return(
        <div>
            <CustomizedIconButton
                    size="small"
                    onClick={handleOpen}
                    startIcon={<AddCircleIcon/>}
                >
                    Add Graphic
            </CustomizedIconButton>
            {/* <button type="button" onClick={handleOpen}>
                Open Modal
            </button> */}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Graphic
                </DialogTitle>
                <DialogContent dividers>
                    {body}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                            disabled={buttonStatus}
                            onClick={AddGraphic}
                            color="primary"
                            className={classes.button}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}