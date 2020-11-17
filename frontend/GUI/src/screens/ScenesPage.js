import React, { useEffect, useState, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Paper } from '@material-ui/core/';
import Switch from '@material-ui/core/Switch';
import AddScene from '../modals/AddScene';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const ColorSwitch = withStyles({
    switchBase: {
      color: '#fff',
      '&$checked': {
        color: '#fff',
      },
      '&$checked + $track': {
        backgroundColor: '#00ff00',
      },
    },
    checked: {},
    track: {},
  })(Switch);


const useStyles = makeStyles((theme) => ({
    sem: {
        paddingTop: 100,
        textAlign: "center"
    },
  center: {
      paddingTop: 30,
      textAlign: "center"
  },
  grid: {
      width: "100%",
      margin: "0px",
      justify: "center"
      
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: "#fff",
    background: "#2d2d2e",
    borderRadius: '15px',
    opacity: 0.8,
  },
  formControl: {
    textAlign:"center",
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function ScenesPage(props) {

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;

    const socket = props.socket;

    const classes = useStyles();

    const [Scenes, setScenes] = useState([]);
    const [Devices, setDevices] = useState([]);

    const [datenow, setDateNow] = useState((new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace("T", " "));

    const isCancelled = useRef(false);

    useEffect(() => {
        socket.emit("GETSCENES");
        socket.emit("GETDEVICES");
        socket.on("Scenes", data => {
            if(!isCancelled.current){
                setScenes(data);
            }
        })
        socket.on("Devices", data => {
            if(!isCancelled.current){
                setDevices(data);
            }
        })
        setInterval(() => {
            if(!isCancelled.current){
                setDateNow((new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace("T", " "));
            }
        }, 1000);
        return () => {
            isCancelled.current = true;
        }
    },[socket, tzoffset])

    function changeStatus(scene, state){
        socket.emit("SceneStatus", {_id: scene, state: !state})
        socket.emit("GETSCENES");
    }

    function DeleteScene(event, id) {
        event.preventDefault();
        socket.emit("DeleteScene", {_id: id});
        socket.emit("GETSCENES");
      }

    return (
        <div>
            <AddScene socket={socket}/>
        <div className={classes.center}>
            <h1>{datenow}</h1>
            {/* <CustomizedIconButton
                    component={Link}
                    size="small"
                    to="/scenes_settings"
                    aria-label="settings from graphics"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    startIcon={<SettingsIcon/>}
                >
                    Scenes Settings
            </CustomizedIconButton> */}
            {/* <br></br> */}
            {
                Scenes.length ? (
                    <Grid
                        container
                        spacing={6}
                        className={classes.grid}
                    >
                        {
                            Scenes.map((scene) => (
                                <Grid item xs={12} md={6} lg={4} key={scene._id}>
                                    <Paper className={classes.paper}>
                                        <Grid container justify="flex-end" alignItems="flex-end">
                                            <IconButton style={{color: 'white'}} onClick={e => DeleteScene(e, scene._id)}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Grid>
                                    { scene.sensor ? (
                                            <>
                                            <Typography variant="h6">{Devices.map(device => device.ieeeAddr === scene.sensor ? (device.friendly_name) : false)}: IF {scene.conditionParameter}{scene.conditionOperator}{scene.conditionState} THEN</Typography>
                                            <Typography variant="h6">{Devices.map(device => device.ieeeAddr === scene.atuator ? (device.friendly_name) : false)} {scene.thenParameter} {scene.thenState}</Typography>
                                            </>
                                        ) : (
                                            <>
                                            <Typography variant="h6">{scene.date} THEN</Typography>
                                            <Typography variant="h6">{Devices.map(device => device.ieeeAddr === scene.atuator ? (device.friendly_name) : false)} {scene.thenParameter} {scene.thenState}</Typography>
                                            </>
                                        )}
                                        <ColorSwitch checked={scene.state} onChange={() => changeStatus(scene._id, scene.state)} />
                                        </Paper>
                                </Grid>
                            ))
                        }
                    </Grid>
                ) : (
                    <div className={classes.sem}>
                        <Typography variant="h3">NO SCENES TO SHOW</Typography>
                    </div>
                )

            }
        </div>
        </div>
    )
}
