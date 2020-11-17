import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, FormControl, RadioGroup, Radio, FormControlLabel, Select, MenuItem, TextField, InputLabel, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles((theme) => ({
  center: {
      paddingTop: 20,
      textAlign: "center"
  },
  paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
  formControl: {
      textAlign:"center",
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
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

export default function AddScene(props) {
  const [open, setOpen] = useState(false);
  // const [scroll, setScroll] = useState('paper');
  // const scroll = 'paper';

  const socket = props.socket;

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;

    const classes = useStyles();

    // const [modalStyle] = useState(getModalStyle);

    const isCancelled = useRef(false);

    const [scenetype, setSceneType] = useState('Simple');
    const [startDate, setStartDate] = useState(new Date());

    const [err, setErr] = useState('');


    const [Devices, setDevices] = useState([]);
    const [Data, setData] = useState([]);
    const [sensor, setSensor] = useState('');
    const [sensorParameters, setSensorParameters] = useState([]);
    const [sensorParameter, setSensorParameter] = useState('');
    const [conditionOperator, setConditionOperator] = useState('');
    const [valueOperation, setValueOperation] = useState('');
    const [atuator, setAtuator] = useState('');
    const [atuatorParameter, setAtuatorParameter] = useState('');
    const [atuatorParameters, setAtuatorParameters] = useState([]);
    const [atuatorValue, setAtuatorValue] = useState('');
    const [operatortoSend, setOperatortoSend] = useState('');

    const [buttonStatus, setButtonStatus] = useState(true);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

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

const handleOpen = () => {
    setOpen(true);
}

const handleClose = () => {
    setOpen(false);
}

useEffect(() => {
    setSensorParameter('');
    setValueOperation('');
    setConditionOperator('');
  },[sensor])

  useEffect(() => {
    setAtuatorParameter('');
    setAtuatorValue('');
    setAtuatorParameter('');
  },[atuator])

  useEffect(() => {
    let ObjectSensorParameters = Object.assign({}, ...Data.filter(item => item.device_id === sensor).splice(0,1))
    let bannedParameters = ['_id','device_id','date','color','__v','linkquality'];
    setSensorParameters(Object.keys(ObjectSensorParameters).filter(item => !bannedParameters.includes(item)))
  },[sensor, Data])

  useEffect(() => {
    let ObjectAtuatorParameters = Object.assign({}, ...Data.filter(item => item.device_id === atuator).splice(0,1))
    let bannedParameters = ['_id','device_id','date','color','__v','linkquality'];
    setAtuatorParameters(Object.keys(ObjectAtuatorParameters).filter(item => !bannedParameters.includes(item)))
  },[atuator, Data])

   
  useEffect(() => {
    setConditionOperator('');
    setValueOperation('');
  }, [sensorParameter])

  useEffect(() => {
    if(conditionOperator === 'EQUALS TO'){
      setOperatortoSend('===');
    } else if (conditionOperator === 'DIFFERENT THAN'){
      setOperatortoSend('!==')
    } else if (conditionOperator === 'GREATER THAN'){
      setOperatortoSend('>')
    } else if (conditionOperator === 'SMALLER THAN'){
      setOperatortoSend('<')
    }
  }, [conditionOperator])

  function AddScene(event){
    event.preventDefault();
    if(scenetype === 'Simple'){
      socket.emit("NewScene", {
        sensor: sensor,
        conditionParameter: sensorParameter,
        conditionOperator: operatortoSend,
        conditionState: valueOperation,
        atuator: atuator,
        thenParameter: atuatorParameter,
        thenState: atuatorValue
      });
    } else if (scenetype === 'Date'){
      socket.emit("NewScene", {
        date: startDate,
        atuator: atuator,
        thenParameter: atuatorParameter,
        thenState: atuatorValue
      });
    }
    socket.emit("GETSCENES");
    setOpen(false);
  }

  useEffect(() => {
    setSensor('');
    setAtuator('');
    setConditionOperator('');
    setValueOperation('');
    setAtuatorValue('');
    setSensorParameter('');
    setAtuatorParameter('');
    if(scenetype === 'Date'){
      setStartDate(new Date())
    } else {
      setStartDate('');
    }
  }, [scenetype])

  useEffect(() => {
    if(scenetype === 'Date' && startDate && atuator && atuatorParameter && atuatorValue){
      setButtonStatus(false);
    }
    else if (scenetype === 'Simple' && sensor && sensorParameter && conditionOperator && valueOperation && atuatorParameter && atuatorValue){
      setButtonStatus(false);
    }
    else {
      setButtonStatus(true);
    }
  }, [scenetype, startDate, sensor, sensorParameter, conditionOperator, valueOperation, atuator, atuatorParameter, atuatorValue])


  const body = (
    // <div>
        <form className={classes.center}>
            <FormControl component="fieldset">
                    <RadioGroup row aria-label="position" name="position" value={scenetype} onChange={e => setSceneType(e.target.value)}>
                        <FormControlLabel
                            value="Simple"
                            control={<Radio color="primary" />}
                            label="Simple"
                            labelPlacement="top"
                        />
                        <FormControlLabel
                            value="Date"
                            control={<Radio color="primary" />}
                            label="Date"
                            labelPlacement="top"
                        />
                    </RadioGroup>
            </FormControl> <br/>
            
            {
              scenetype === 'Simple' ? (
                <>
                <Typography variant="h5">IF</Typography>
                    <FormControl className={classes.formControl}>
                    <InputLabel>Sensor</InputLabel>
                      <Select 
                        value={sensor}
                        onChange={(e) => setSensor(e.target.value)}
                      >
                        {
                          Devices.map(device => (
                            <MenuItem value={device.ieeeAddr} key={device.ieeeAddr}>{device.friendly_name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                    <InputLabel>Parameter</InputLabel>
                      <Select
                        value={sensorParameter}
                        onChange={(e) => setSensorParameter(e.target.value)}
                      >
                        {
                          sensorParameters.map(item => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                    <InputLabel>Operator</InputLabel>
                      
                        {
                          sensorParameter === 'occupancy' || sensorParameter === 'state' ? (
                            <Select
                              value={conditionOperator}
                              onChange={(e) => setConditionOperator(e.target.value)}
                            >
                            <MenuItem value="EQUALS TO">===</MenuItem>
                            </Select>
                          ) : (
                            <Select
                              value={conditionOperator}
                              onChange={(e) => setConditionOperator(e.target.value)}
                            >
                            <MenuItem value="EQUALS TO">EQUALS TO</MenuItem>
                            <MenuItem value="DIFFERENT THAN">DIFFERENT THAN</MenuItem>
                            <MenuItem value="GREATER THAN">GREATER THAN</MenuItem>
                            <MenuItem value="SMALLER THAN">SMALLER THAN</MenuItem>
                            </Select>
                          )
                        }
                          
                          {/* </div>
                        ) : false} */}
                        
                      
                    </FormControl>
                    <FormControl className={classes.formControl}>
                    
                      {
                        sensorParameter === 'state' ? (
                          <>
                            <InputLabel id="demo-simple-select-label">StateValue</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={valueOperation}
                              onChange={(e) => setValueOperation(e.target.value)}
                            >
                              <MenuItem value="ON">ON</MenuItem>
                              <MenuItem value="OFF">OFF</MenuItem>
                          </Select>
                          </>
                        ) : sensorParameter === 'occupancy' ? (
                          <>
                            <InputLabel>StateValue</InputLabel>
                            <Select
                              label="Value"
                              value={valueOperation}
                              onChange={(e) => setValueOperation(e.target.value)}
                            >
                              <MenuItem value="true">true</MenuItem>
                              <MenuItem value="false">false</MenuItem>
                          </Select>
                          </>
                        ) : sensorParameter === 'brightness' ? (
                          <TextField label="Number between 0 - 254" type="number" InputLabelProps={{shrink: true}} value={valueOperation} onChange={(e) => {
                            if (e.target.value>254)
                              setValueOperation(254);
                            else if(e.target.value<0)
                              setValueOperation(0);
                            else setValueOperation(e.target.value);
                          }}/>
                        ) : sensorParameter ==='color_temp' ? (
                          <TextField label="Number between 0 - 508" type="number"  InputLabelProps={{shrink: true}} value={atuatorValue} onChange={(e) => {
                            if(e.target.value>508){
                              setValueOperation(508);
                            } else if(e.target.value<0){
                              setValueOperation(0);
                            } else setValueOperation(e.target.value);
                          }}/>
                        ) : (
                          <TextField label="Value" type="number" InputLabelProps={{shrink: true}} value={valueOperation} onChange={(e) => {
                              if(e.target.value < 0)
                                setValueOperation(0)
                              else setValueOperation(e.target.value)
                            }}/>
                        )
                      }
                      
                    </FormControl>
                    <Typography variant="h5">THEN</Typography>
                    <FormControl className={classes.formControl}>
                    <InputLabel>Atuator</InputLabel>
                      <Select
                        value={atuator}
                        onChange={(e) => setAtuator(e.target.value)}
                      >
                        {
                          Devices.map(device => (
                            <MenuItem value={device.ieeeAddr} key={device.ieeeAddr}>{device.friendly_name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                    <InputLabel>Parameter</InputLabel>
                      <Select
                        value={atuatorParameter}
                        onChange={(e) => setAtuatorParameter(e.target.value)}
                      >
                        {
                          atuatorParameters.map(item => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      {
                        atuatorParameter === 'state' ? (
                          <>
                            <InputLabel>StateValue</InputLabel>
                            <Select
                              value={atuatorValue}
                              onChange={(e) => setAtuatorValue(e.target.value)}
                            >
                              <MenuItem value="ON">ON</MenuItem>
                              <MenuItem value="OFF">OFF</MenuItem>
                          </Select>
                          </>
                        ) : atuatorParameter === 'occupancy' ? (
                          <>
                            <InputLabel>StateValue</InputLabel>
                            <Select
                              label="Value"
                              value={atuatorValue}
                              onChange={(e) => setAtuatorValue(e.target.value)}
                            >
                              <MenuItem value="true">true</MenuItem>
                              <MenuItem value="false">false</MenuItem>
                          </Select>
                          </>
                        ) : atuatorParameter === 'brightness' ? (
                            <TextField label="Number between 0 - 254" type="number" InputLabelProps={{shrink: true}} value={atuatorValue} onChange={(e) => {
                              if (e.target.value>254)
                                setAtuatorValue(254);
                              else if(e.target.value<0)
                              setAtuatorValue(0);
                              else setAtuatorValue(e.target.value);
                            }}/>
                        ) : atuatorParameter ==='color_temp' ? (
                          <TextField label="Number between 0 - 508" type="number"  InputLabelProps={{shrink: true}} value={atuatorValue} onChange={(e) => {
                            if(e.target.value>508){
                              setAtuatorValue(508);
                            } else if(e.target.value<0){
                              setAtuatorValue(0);
                            } else setAtuatorValue(e.target.value);
                          }}/>
                        ) : (
                          <TextField label="Value" type="number" InputLabelProps={{shrink: true}} value={atuatorValue} onChange={(e) => {
                            if(e.target.value<0){
                              setAtuatorValue(0)
                            } else setAtuatorValue(e.target.value);
                          }}/>
                        )
                      }
                      
                    </FormControl>
                </>
              ) : (
                <>
                    {/* <br/>
                    <br/> */}
                    <FormControl className={classes.root}>
                        <TextField
                            id="startDate"
                            label="Start Date"
                            type="datetime-local"
                            defaultValue={new Date(Date.now() - tzoffset).toISOString().slice(0, -8)}
                            InputProps={{ inputProps: { min: new Date(Date.now() - tzoffset).toISOString().slice(0, -8) } }}
                            onChange={UpdateDate}
                            helperText={err}
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                    </FormControl><br/>
                    <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Atuator</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={atuator}
                        onChange={(e) => setAtuator(e.target.value)}
                      >
                        {
                          Devices.map(device => (
                            <MenuItem value={device.ieeeAddr} key={device.ieeeAddr}>{device.friendly_name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                    <InputLabel>Parameter</InputLabel>
                      <Select
                        value={atuatorParameter}
                        onChange={(e) => setAtuatorParameter(e.target.value)}
                      >
                        {
                          atuatorParameters.map(item => (
                            <MenuItem value={item} key={item}>{item}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                      {
                        atuatorParameter === 'state' ? (
                          <>
                            <InputLabel>StateValue</InputLabel>
                            <Select
                              value={atuatorValue}
                              onChange={(e) => setAtuatorValue(e.target.value)}
                            >
                              <MenuItem value="ON">ON</MenuItem>
                              <MenuItem value="OFF">OFF</MenuItem>
                          </Select>
                          </>
                        ) : atuatorParameter === 'occupancy' ? (
                          <>
                            <InputLabel id="demo-simple-select-label">StateValue</InputLabel>
                            <Select
                              label="Value"
                              value={atuatorValue}
                              onChange={(e) => setAtuatorValue(e.target.value)}
                            >
                              <MenuItem value="true">true</MenuItem>
                              <MenuItem value="false">false</MenuItem>
                          </Select>
                          </>
                        ) : atuatorParameter === 'brightness' ? (
                          <TextField label="Number between 0 - 254" type="number"  InputLabelProps={{shrink: true}} value={atuatorValue} onChange={(e) => {
                            if(e.target.value>254){
                              setAtuatorValue(254);
                            } else if(e.target.value<0){
                              setAtuatorValue(0);
                            } else setAtuatorValue(e.target.value);
                          }}/>
                        ) : atuatorParameter ==='color_temp' ? (
                            <TextField label="Number between 0 - 508" type="number"  InputLabelProps={{shrink: true}} value={atuatorValue} onChange={(e) => {
                              if(e.target.value>508){
                                setAtuatorValue(508);
                              } else if(e.target.value<0){
                                setAtuatorValue(0);
                              } else setAtuatorValue(e.target.value);
                            }}/>
                        ) : (
                          <TextField label="Value" type="number" InputLabelProps={{shrink: true}} value={atuatorValue} onChange={(e) => {
                            if(e.target.value<0){
                              setAtuatorValue(0)
                            }else setAtuatorValue(e.target.value);
                          }}/>
                        )
                      }
                    </FormControl>
                </>
              )
            }
            
            {/* <br/>
            <Button
                    disabled={buttonStatus}
                    className={classes.button}
                    type="submit"
                    onClick={AddScene}
            >
                Submit
            </Button> */}
        </form>
        // </div>
    )

    function UpdateDate(event){
      const checkDate = Date.parse(event.target.value);
      if(isNaN(checkDate) === false){
          const date = new Date(event.target.value);
          date.setSeconds(0)
          date.setMilliseconds(0);
          setStartDate(new Date(date - tzoffset).toISOString().slice(0, -5));
          setErr('');
      } else {
          setErr('Invalid Date!!');
      }
  }

  return (
    <div>
      <CustomizedIconButton
                    size="small"
                    onClick={handleOpen}
                    startIcon={<AddCircleIcon/>}
                >
                    Add Scene
      </CustomizedIconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add Scene</DialogTitle>
        <DialogContent dividers>
            {body}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
              disabled={buttonStatus}
              color="primary"
              onClick={AddScene}
          >
                    Submit
                </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}