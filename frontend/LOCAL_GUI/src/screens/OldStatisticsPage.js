import React, { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
          margin: theme.spacing(2),
          width: '25ch',
        },
      },
    center: {
      paddingTop: 20,
      textAlign: "center",
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
        textAlign:"center",
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
}));

// const Title = withStyles({
//     root: {
//       textAlign:"center",
//       color: "#000",
//       paddingTop: 10
//     }
//   })(Typography);


export default function StatisticsPage(props) {

    const socket = props.socket;

    const classes = useStyles();

        
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  
    const [tax, setTax] = useState(0);
    const [sumPower, setSumPower] = useState(0);

    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    const [errStartDate, setErrStartDate] = useState('');
    const [errEndDate, setErrEndDate] = useState('');

    const [Devices,setDevices] = useState([]);
    const [Data,setData] = useState([]);

    const [startDate, setStartDate] = useState(new Date(Date.now() - tzoffset).toISOString().slice(0, -8));
    const [endDate, setEndDate] = useState(new Date(Date.now() - tzoffset).toISOString().slice(0, -8));

    const [device, setDevice] = useState('');
    const [parameter, setParameter] = useState('');
    const [parameters, setParameters] = useState([]);
    const [value, setValue] = useState(0);
    // const device = "0x04cf8cdf3c763c62";
    // const parameter = "power";

    const [datenow, setDateNow] = useState((new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace("T", " "));

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

    // useEffect(() => {
    //     if(parameter.length > 0){
    //         setButtonStatus(false);
    //     }
    // },[parameter])

    useEffect(() => {
        let paramData = []; let a = 0; let b = 0;
        let dates = []; let power, dif_time, dif_in_seconds, sum_power = 0;
        const DataFromDevice = Data.filter(element => element.device_id === device).reverse();
        DataFromDevice.forEach((element, index) => {
            // const date = new Date(element.date).toISOString();
            // console.log(new Date(new Date(element.date) - tzoffset).toISOString().slice(0, -5));
            // console.log()
            const date = new Date(new Date(element.date) - tzoffset).toISOString().slice(0, -5)
            if(date > startDate && date < endDate){ 
                if (a === 0){
                    a = index; 
                }                                   
                paramData.push(element[parameter]);
                dates.push(date);
                b = index;
            } 
        });

        DataFromDevice.forEach((element, index) => index === (a - 1) ? (
            // console.log(element),
            paramData.splice(0, 0, element[parameter])
         ) : false)
        DataFromDevice.forEach((element, index) => b!== 0 && index === b ? (
            // console.log(element),
            paramData.splice(paramData.length, 0, element[parameter])
            // dates.splice(dates.length, 0, endDate)
         ) : false)
        if( a === 0 & b === 0){
            paramData.splice(0, 0, 0);
            paramData.splice(paramData.length, 0, 0);
        }
        dates.splice(0, 0, startDate);
        dates.splice(dates.length, 0, endDate)
        // console.log(paramData);
        // console.log(dates);
        if(parameter === 'power'){
            for (var i = 0; i < paramData.length; i++){
                if(paramData[i+1]){
                    power = paramData[i]+paramData[i+1];
                    dif_time = Math.abs(Date.parse(dates[i+1]) - Date.parse(dates[i]))
                    dif_in_seconds = dif_time / 1000;
                    sum_power = sum_power + (power/2)*dif_in_seconds;
              }
            }
            setSumPower(sum_power);
        } else {
            const soma = paramData.reduce((a,b) => a + b, 0);
            setValue(soma/paramData.length);
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

    return (
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
                        <TextField
                            label="Tax"
                            type="number"
                            onChange={e => setTax(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <p>Energy: {sumPower} W.s = {(sumPower/3.6e6)} kwh</p>
                        <p>Price: {((sumPower/3.6e6)*tax)}€</p>
                    </>
                ) : parameter === 'brightness' ? (
                    <h3>Average Brightness≈ {(value * 100/255).toFixed(0)}%</h3>
                ) : parameter === 'color_temp' ? (
                    <h3>Average Color Temperature≈ {(value * 100/510).toFixed(0)} %</h3>
                ) : parameter === 'temperature' ? (
                    <h3>Average Temperature≈ {value.toFixed(2)}ºC</h3>
                ) : parameter === 'voltage' ? (
                    value > 1000 ? (<h3>Average Voltage≈ {value.toFixed(2)} mV</h3>) : (<h3>Average Voltage≈ {value.toFixed(2)} V</h3>)
                ) : parameter === 'humidity' ? (
                    <h3>Average Humidity≈ {value.toFixed(2)}%</h3>
                ) : parameter === 'pressure' ? (
                    <h3>Average Pressure≈ {value.toFixed(2)}mBar</h3>
                ) : parameter === 'current' ? (
                    <h3>Average Current≈ {value.toFixed(2)}A</h3>
                ) : parameter === 'consumption' ? (
                    <h3>Average Consumption≈ {value.toFixed(2)}W</h3>
                ) : false
            }
        </div>
    )
}

