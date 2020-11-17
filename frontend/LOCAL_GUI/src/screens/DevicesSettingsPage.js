import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Button, TextField, MenuItem } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

import EditDevice from '../modals/EditDevice';

const useStyles = makeStyles((theme) => ({
    root:{
        justifyContent: 'center'
    },
    grid: {
      width: "100%",
      margin: "0px",
      
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: "#fff",
      opacity: 0.8,
      borderRadius: '15px',
      background: "#2d2d2e",
    },
    button: {
      margin: theme.spacing(1),
    },
    ooo: {
        justifyContent: 'center'
    },
    whiteColor: {
        color: "white"
      }
  }));
  

// const Title = withStyles({
//     root: {
//       textAlign:"center",
//       color: "#000",
//       paddingTop: 10
//     }
//   })(Typography);

// const CustomizedIconButton = withStyles({
//     root:{
//         textAlign: "center",
//         background: '#000',
//         color: '#fff',
//         '&:hover': {
//             backgroundColor: '#bbb',
//             color: '#000'
//         },
//     }
// })(Button)



export default function DevicesSettingsPage(props) {

    const socket = props.socket;

    const classes = useStyles();

    const [devices, setDevices] = useState([]);
    const [divisions, setDivisions] = useState([]);

    const isCancelled = useRef(false);

    useEffect(() => {
        socket.emit("GETDIVISIONS");
        socket.emit("GETDEVICES");
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

    async function RemoveDevice(item){
        socket.emit("DeleteDevice", { ieeeAddr: item});
      }

      const handleChange = (event, device) => {
          if(!isCancelled.current){
            socket.emit("UpdateDeviceDivision", {ieeeAddr: device, division: event.target.value})
          }
      };

    return (
        <>
        <div>
            {/* <Title variant="h3">Devices Settings</Title> */}
            
            <Grid container spacing={6} className={classes.grid}>
                {
                    devices.map(item => item.type !== "Coordinator" ? ( 
                    <Grid item xs={12} md={6} lg={3} key={item.ieeeAddr}>
                        <Paper className={classes.paper}>
                            {item.friendly_name ? <p>Name: <b>{item.friendly_name}</b></p> : false}
                            {item.type ? <p>Type: <b>{item.type}</b></p> : false}
                            {item.vendor ? <p>Vendor: <b>{item.vendor}</b></p> : false}
                            {item.model ? <p>Model: <b>{item.model}</b></p> : false}
                            {item.description ? <p>Description: <b>{item.description}</b></p> : false}
                            <TextField
                                id="standard-select-division"
                                style={{color: "#fff"}}
                                select
                                label="Select"
                                InputProps={{
                                    className: classes.whiteColor
                                  }}
                                FormHelperTextProps={{
                                    className: classes.whiteColor
                                  }}
                                value={item.division}
                                onChange={(e) => handleChange(e, item.ieeeAddr)}
                                helperText="Please select division for this device"
                                >
                                {
                                    
                                    divisions.map((option) => (
                                    <MenuItem key={option.name} value={option.name}>
                                        {option.name}
                                    </MenuItem>
                                    ))
                                }
                            </TextField><br></br>
                            <EditDevice name={item.friendly_name} socket={props.socket} />
                            <Button
                                size="small" 
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                startIcon={<DeleteIcon />}
                                onClick={() => RemoveDevice(item.ieeeAddr)}
                            >
                                Delete
                            </Button>
                        </Paper>
                    </Grid>
                    ) : false)
                }

            </Grid>
        </div>
        </>
    )
}
