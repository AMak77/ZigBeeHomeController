import React, { useEffect, useState, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';

import DataDevice from '../components/DataDevice';
import ChangeParameters from '../components/ChangeParameters';

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
        opacity: 0.8,
        // background: "transparent",
        borderRadius: '15px',
        height: 450
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

// const Title = withStyles({
//     root: {
//       textAlign:"center",
//       color: "#fff",
//       paddingTop: 10,
//     }
//   })(Typography);

export default function DevicesPage (props) {

    const socket = props.socket;

    const classes = useStyles();

    const [devices, setDevices] = useState([]);

    const [data, setData] = useState([]);

    const isCancelled = useRef(false);
    
    useEffect(() => {
        socket.emit("GETDEVICES");
        socket.emit("GETMEASUREMENTS");
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
    },[socket])

    return (
        <div>
            {/* <Title variant="h3">
                Devices Page
            </Title> */}
            <CustomizedIconButton
                    size="small"
                    component={Link}
                    to="/devices_settings"
                    aria-label="settings from user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    startIcon={<SettingsIcon/>}
                >
                    Settings
            </CustomizedIconButton>
            { devices.length ? (
                <Grid container spacing={6} className={classes.grid}>
                {devices.map(item => item.type !== "Coordinator" ? (
                    <Grid item xs={12} md={6} lg={3} key={item.ieeeAddr}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" gutterBottom>
                                {item.friendly_name}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                {item.description}
                            </Typography>
                            <DataDevice id={item.ieeeAddr} data={data} />
                            <ChangeParameters id={item.ieeeAddr} model={item.model} data={data} socket={props.socket} />
                        </Paper>
                        </Grid>
                    
                    ) : false )}
                </Grid>
                ) : (
                    <div className={classes.sem}>
                        <Typography variant="h3">NO DEVICES TO SHOW</Typography>
                    </div>
                )
            }
            
            
        </div>
    )
}
