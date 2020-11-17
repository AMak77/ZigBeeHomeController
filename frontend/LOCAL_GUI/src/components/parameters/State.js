import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
      paddingTop: 10,
      flexGrow: 1
  }
});


const ON = withStyles((theme) => ({
    root: {
      backgroundColor: '#fff',
      color: '#008000',
      '&:hover': {
        backgroundColor: '#008000',
        color: '#fff'
      },
    },
  }))(Button);

const OFF = withStyles((theme) => ({
    root: {
      backgroundColor: '#fff',
      color: '#ff0000',
      '&:hover': {
        backgroundColor: '#ff0000',
        color: '#fff'
      },
    },
  }))(Button);

export default function State(props) {
    const socket = props.socket;

    const classes = useStyles();
    
    return(
      <Grid container className={classes.root}>
            <Grid item xs>
                <Grid container justify="center"  spacing={2}>
                    <Grid item>
                      <ON size="small" onClick={() => socket.emit("state", {device_id: props.id, state: "ON"})}>ON</ON>
                    </Grid>
                    <Grid item>
                      <OFF size="small" onClick={() => socket.emit("state", {device_id: props.id, state: "OFF"})}>OFF</OFF>
                    </Grid>
                </Grid>
          </Grid>
      </Grid>
    )
}
