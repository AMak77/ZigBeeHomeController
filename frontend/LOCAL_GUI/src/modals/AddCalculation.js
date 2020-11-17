import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, Dialog, DialogTitle, DialogContent  } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';

// function getModalStyle() {
//     const top = 15;

//     return {
//       top: `${top}%`,
//       margin:'auto'
//     };
//   }

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
    modalStyle1:{
        position:'absolute',
        top:'10%',
        margin: 'auto',
        overflow:'scroll',
        display:'block',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },

      formControl: {
          textAlign:"center",
          margin: theme.spacing(1),
          minWidth: 200,
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

export default function AddCalculation(props){
    const socket = props.socket;

    const classes = useStyles();

    // const [modalStyle] = useState(getModalStyle);

    const [open, setOpen] = useState(false);

    const [Data, setData] = useState([]);
    const [Devices, setDevices] = useState([]);

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  
    const [tax, setTax] = useState(0);
    // const [sumPower, setSumPower] = useState(0);

    const [errStartDate, setErrStartDate] = useState('');
    const [errEndDate, setErrEndDate] = useState('');

    const [device, setDevice] = useState('');
    const [parameter, setParameter] = useState('');
    const [parameters, setParameters] = useState([]);
    const [value, setValue] = useState(0);

    const [startDate, setStartDate] = useState(new Date(Date.now() - tzoffset).toISOString().slice(0, -8));
    const [endDate, setEndDate] = useState(new Date(Date.now() - tzoffset).toISOString().slice(0, -8));

    const [datenow, setDateNow] = useState((new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace("T", " "));

    const isCancelled = useRef(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

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
        setInterval(() => {
                if(!isCancelled.current){
                    setDateNow((new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace("T", " "));
                }
        }, 1000);
        return () => {
            isCancelled.current = true;
        }
    }, [socket, tzoffset])

    useEffect(() => {
        let ObjectParameters = Object.assign({}, ...Data.filter(item => item.device_id === device).splice(0,1))
        let bannedParameters = ['_id','device_id','date','color','__v','linkquality'];
        setParameters(Object.keys(ObjectParameters).filter(item => !bannedParameters.includes(item)))
    },[device, Data])

    useEffect(() => {
        setParameter('');
    }, [device])

    useEffect(() => {
        if(Data && endDate && startDate && endDate && startDate < endDate && tzoffset && device && parameter){
            const DataFromDevice = Data.filter(element => element.device_id === device).reverse();
            const startDateMilliseconds = new Date(startDate).getTime();
            const endDateMilliseconds = new Date(endDate).getTime();
            let ParameterData = [];
            let Dates = [];
            let AllDates = [];
            DataFromDevice.forEach((element, index) => {
                const date = new Date(new Date(element.date) - tzoffset).toISOString().slice(0, -5)
                if( date > startDate && date < endDate ){
                    ParameterData.push(element[parameter]);
                    Dates.push(date);
                } 
                AllDates.push(new Date(element.date).getTime());
            })
            Dates.splice(0, 0, startDate);
            Dates.splice(Dates.length, 0, endDate);
            // console.log(Dates);
            let start = Math.max(...AllDates.filter(num => num <= startDateMilliseconds));
            let end = Math.max(...AllDates.filter(num => num <= endDateMilliseconds));
            DataFromDevice.forEach(element => new Date(element.date).getTime() === start ? (
                ParameterData.splice(0, 0, element[parameter])
            ) : false)
            DataFromDevice.forEach(element => new Date(element.date).getTime() === end ? (
                ParameterData.splice(ParameterData.length, 0, element[parameter])
            ) : false)
            // console.log(ParameterData);
            let TimeIntervals = Dates.map(i => new Date(i).getTime());
            let Intervals = TimeIntervals.slice(1).map((x,i) => x - TimeIntervals[i]);
            let sum = [];
            for (let i = 0; i < ParameterData.length; i++){
                if(ParameterData[i+1])
	                sum.push(((ParameterData[i]+ParameterData[i+1])/2)*Intervals[i])
            }
            const numerator = sum.reduce((a, b) => a + b, 0);
            const denominator = Intervals.reduce((a, b) => a + b, 0);
            setValue((numerator/denominator).toFixed(2));
        }

    }, [Data, endDate, startDate, tzoffset, device, parameter])

    function UpdateStartDate(event){
        const checkDate = Date.parse(event.target.value);
        if(isNaN(checkDate) === false){
            const date = new Date(event.target.value);
            date.setSeconds(0)
            date.setMilliseconds(0);
            setStartDate(new Date(date - tzoffset).toISOString().slice(0, -5));
            setErrStartDate('');
        } else {
            setErrStartDate('Invalid Date!!');
        }
    }

    function UpdateEndDate(event){
        const checkDate = Date.parse(event.target.value);
        if(isNaN(checkDate) === false){
            const date = new Date(event.target.value);
            date.setSeconds(0)
            date.setMilliseconds(0);
            setEndDate(new Date(date - tzoffset).toISOString().slice(0, -5));
            setErrEndDate('');
        } else {
            setErrEndDate('Invalid Date!!');
        }
    }

    useEffect(() => {
        if(startDate > endDate){
            setErrStartDate('Invalid Date');
            setErrEndDate('Invalid Date');
        } else {
            setErrStartDate('');
            setErrEndDate('');
        }
    },[startDate, endDate])


    const body = (
        <div className={classes.center}>
            <h1>{datenow}</h1>
            <FormControl className={classes.formControl}>
                    <InputLabel>Select the device:</InputLabel>
                    <Select 
                            id="device"
                            value={device}
                            onChange={(e) => setDevice(e.target.value)}
                          >
                            {
                              Devices.map(device => (
                                <MenuItem value={device.ieeeAddr} key={device.ieeeAddr}>{device.friendly_name}</MenuItem>
                              ))
                            }
                          </Select>
                          <FormControl className={classes.formControl}>
                    <InputLabel>Parameter</InputLabel>
                    <Select 
                        id="parameter"
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
                </FormControl><br/>
            </FormControl>
            <form noValidate className={classes.root}>
                <TextField
                    id="startDate"
                    style={{paddingRight: 6}}
                    label="Start Date"
                    type="datetime-local"
                    defaultValue={new Date(Date.now() - tzoffset).toISOString().slice(0, -8)}
                    InputProps={{ inputProps: { max: new Date(Date.now() - tzoffset).toISOString().slice(0, -8) } }}
                    onChange={UpdateStartDate}
                    helperText={errStartDate}
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                <TextField
                    id="endDate"
                    label="End Date"
                    type="datetime-local"
                    defaultValue={new Date(Date.now() - tzoffset).toISOString().slice(0, -8)}
                    InputProps={{ inputProps: { max: new Date(Date.now() - tzoffset).toISOString().slice(0, -8) } }}
                    onChange={UpdateEndDate}
                    helperText={errEndDate}
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
            </form>
            <br></br>
            
            {
                parameter === 'power' ? (
                    <>
                        <h3>Average Power≈ {value} W</h3>
                        <TextField
                            label="Tax"
                            type="number"
                            onChange={e => setTax(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <p>Energy: {(value*(new Date(endDate).getTime() - new Date(startDate).getTime())/1000).toFixed(2)} W.s = {((value*(new Date(endDate).getTime() - new Date(startDate).getTime())/1000)/3.6e6)} kwh</p>
                        <p>Price: {(((value*(new Date(endDate).getTime() - new Date(startDate).getTime())/1000)/3.6e6)*tax)}€</p>
                    </>
                ) : parameter === 'brightness' ? (
                    <h3>Average Brightness≈ {(value * 100/255).toFixed(0)}%</h3>
                ) : parameter === 'color_temp' ? (
                    <h3>Average Color Temperature≈ {(value * 100/510).toFixed(0)} %</h3>
                ) : parameter === 'temperature' ? (
                    <h3>Average Temperature≈ {value}ºC</h3>
                ) : parameter === 'voltage' ? (
                    value > 1000 ? (<h3>Average Voltage≈ {value} mV</h3>) : (<h3>Average Voltage≈ {value} V</h3>)
                ) : parameter === 'humidity' ? (
                    <h3>Average Humidity≈ {value}%</h3>
                ) : parameter === 'pressure' ? (
                    <h3>Average Pressure≈ {value}mBar</h3>
                ) : parameter === 'current' ? (
                    <h3>Average Current≈ {value}A</h3>
                ) : parameter === 'consumption' ? (
                    <h3>Average Consumption≈ {value}W</h3>
                ) : false
            }
        </div>
    )

    return(
        <div>
            <CustomizedIconButton
                    size="small"
                    onClick={handleOpen}
                    startIcon={<AddCircleIcon/>}
                >
                    Set Calculation
            </CustomizedIconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={'paper'}
            >
                <DialogTitle id="scroll-dialog-title">Calculate average value</DialogTitle>
                <DialogContent dividers>
                    {body}
                </DialogContent>
            </Dialog>
        </div>
    )
}