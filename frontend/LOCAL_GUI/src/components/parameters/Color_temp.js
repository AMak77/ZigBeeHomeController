import React from 'react';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Icon  } from '@iconify/react';
import fireIcon from '@iconify/icons-mdi/fire';
import snowflakeCold from '@iconify/icons-wi/snowflake-cold'; 


const useStyles = makeStyles({
    root: {
        paddingTop: 30,
        flexGrow: 1
    },
    slider:{
        width: 150
    }
  });

export default function ColorTemperature(props) {
    const socket = props.socket;
    const classes = useStyles();

    function valuetext(value) {
        return `${value}%`;
      }



    return (
        <Grid container className={classes.root}>
                <Grid item xs>
                    <Grid container justify="center"  spacing={2}>
                        <Grid item>
                            <Icon icon={snowflakeCold} widht="24" height="24"/>
                        </Grid>
                        <Grid item>
                            <Slider
                                    className={classes.slider}
                                    defaultValue={50}
                                    getAriaValueText={valuetext}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={25}
                                    marks
                                    min={0}
                                    max={100}
                                    onChangeCommitted={(e,val) => socket.emit("color_temp", {device_id: props.id, color_temp: parseInt(val*510/100)})}
                                />
                        </Grid>
                        <Grid item>
                            <Icon icon={fireIcon} widht="30" height="30"/>
                        </Grid>
                    </Grid>
               </Grid>
        </Grid>
    )
}
