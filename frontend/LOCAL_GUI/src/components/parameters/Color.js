import React, { useState } from 'react';
import { HuePicker } from 'react-color';
import { makeStyles } from '@material-ui/core/styles';
import PaletteIcon from '@material-ui/icons/Palette';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    primary:{
        paddingTop: 10
    },
    root: {
        paddingTop: 20,
        flexGrow: 1,
        background: '#2d2d2e',
        borderRadius: 10
    }
  });

export default function Color(props) {
    const socket = props.socket;
    const classes = useStyles();
    const [color, setColor] = useState('#fff');

    const [showColorPicker, setShowColorPicker] = useState(false);

    async function SubmitColor(){
        socket.emit("ColorPicker", {device_id: props.id, color: color})
    }

    return(
        <div className={classes.primary}>
            <Button onClick={() => setShowColorPicker(showColorPicker => !showColorPicker)}><PaletteIcon/></Button>
            {
                showColorPicker && (
                    <Grid container className={classes.root}>
                        <Grid item xs>
                            <Grid container justify="center">
                                <Grid item>
                                    <HuePicker
                                            className={classes.picker}
                                            color={color}
                                            onChange={updatedColor => setColor(updatedColor.hex)}
                                        />
                                </Grid>
                            </Grid>
                            <Grid item>
                                    <Button size="small" style={{color: "#fff"}}onClick={()=> SubmitColor()}>Submit</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )
            }
        </div>
    )
}
