import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Modal from '../modals/AddDivision';

const useStyles = makeStyles((theme) => ({
    sem: {
        paddingTop: 100,
        textAlign: "center"
    },
    grid: {
        width: "100%",
        margin: "0px"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: "#fff",
        background: "#2d2d2e",
        borderRadius: '15px',
        height: 300,
        opacity: 0.8,
        // overflowY: 'unset',
    },
    customizedButton: {
        // position: 'absolute',
        position: "relative",
        left: '95%',
        top: '-9%',
        backgroundColor: 'red',
        color: 'white',
    }
}))

export default function DivisionsPage(props) {

    const socket = props.socket;

    const classes = useStyles();

    const [divisions, setDivisions] = useState([]);
    const [devices, setDevices] = useState([]);

    const isCancelled = useRef(false);
    
    useEffect(() => {
        socket.emit("GETDIVISIONS");
        socket.emit("GETDEVICES")
        socket.on("Divisions", data => {
            if(!isCancelled.current){
                setDivisions(data);
           }
        })
        socket.on("Devices", data => {
            if(!isCancelled.current){
                setDevices(data);
           }
        })
        return () => {
            isCancelled.current = true;
        }
    },[socket])

    function DeleteDivision(item){
        // event.preventDefault();
        socket.emit("DeleteDivision", {name: item});
        socket.emit("GETDIVISIONS");
    }

    return (
        <div>
            {/* <Title variant="h3">
                Divisions
            </Title> */}
            <Modal socket={socket}/>
            {/* <CustomizedIconButton
                    size="small"
                    component={Link}
                    to="/divisions_settings"
                    aria-label="settings from user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    startIcon={<SettingsIcon/>}
                >
                    Divisions Settings
            </CustomizedIconButton> */}
            {
                divisions.length ? (
                    <Grid container spacing={6} className={classes.grid}>
                        {divisions.map(item => (
                            <Grid item xs={12} md={6} lg={3} key={item.name}>
                                <Paper className={classes.paper}>
                                    <Grid container justify="flex-end" alignItems="flex-end">
                                        <IconButton style={{color: 'white'}} onClick={() => DeleteDivision(item.name)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Grid>
                                    <Typography variant="h5" gutterBottom>
                                        {item.name}
                                    </Typography>
                                    {devices.map(device => device.division === item.name ? (
                                        <li key={device.ieeeAddr} style={{paddingTop: 10}}>
                                            {device.friendly_name}
                                        </li>
                                    ): false)}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <div className={classes.sem}>
                        <Typography variant="h3">NO DIVISIONS TO SHOW</Typography>
                    </div>
                )
            }
            
        </div>
    )
}
