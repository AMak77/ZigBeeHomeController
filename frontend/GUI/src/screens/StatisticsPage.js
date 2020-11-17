import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Paper } from '@material-ui/core/';
import { Line } from 'react-chartjs-2';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

import AddGraphic from '../modals/AddGraphic';
import AddCalculation from '../modals/AddCalculation';


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
        color: "#000",
        // width: 600
    }
}))


export default function GraphicsPage(props) {

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;

    const socket = props.socket;

    const classes = useStyles();

    const [ListGraphics, setListGraphics] = useState([]);
    const [Devices, setDevices] = useState([]);
    const [Data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);

    const isCancelled = useRef(false);

    useEffect(() => {
        socket.emit("GETGRAPHICS");
        socket.emit("GETMEASUREMENTS");
        socket.emit("GETDEVICES");
        socket.on("ListGraphics", data => {
            if(!isCancelled.current){
                setListGraphics(data);
            }
        })
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

    useEffect(() => {
        let chartData = [];
        // const CutData = [];
        // const CutData = Data.splice(0,500);
        setChartData([]);
        ListGraphics.forEach(i => {
            let paramData = [];
            let dates = [];
            let name = '';
            let CutData = [];
            const DataFromEachDevice = Data.filter(element => element.device_id === i.device).reverse();
            if (DataFromEachDevice.length > 100){
                CutData = DataFromEachDevice.slice(DataFromEachDevice.length - 100, DataFromEachDevice.length);
            } else {
                CutData = DataFromEachDevice;
            }
            Devices.forEach(device => device.ieeeAddr === i.device ? name = device.friendly_name : false);
            CutData.forEach(element => {
                if(element.device_id === i.device){
                    if(i.parameter === "state"){
                        if (element[i.parameter] === "ON") {
                            paramData.push(true)
                        } else if (element[i.parameter] === "OFF"){
                            paramData.push(false)
                        }
                        dates.push(new Date(element.date).toLocaleString());
                    } else if (i.parameter === "occupancy"){
                        if (element[i.parameter] === "true") {
                            paramData.push(true)
                        } else if (element[i.parameter] === "false"){
                            paramData.push(false)
                        }
                        dates.push(new Date(new Date(element.date) - tzoffset).toISOString().slice(0, -5).replace(/T/, ' '))
                        // dates.push(new Intl.DateTimeFormat("en-GB",{
                        //     year: "2-digit",
                        //     month: "2-digit",
                        //     day: "2-digit",
                        //     hour: 'numeric', minute: 'numeric', second: 'numeric'
                        // }).format(new Date(element.date)));
                    } else if (i.parameter === 'brightness'){
                        paramData.push((element[i.parameter]*100/255).toFixed(0));
                        dates.push(new Date(new Date(element.date) - tzoffset).toISOString().slice(0, -5).replace(/T/, ' '))
                    } else if (i.parameter === 'color_temp'){
                        paramData.push((element[i.parameter]*100/510).toFixed(0));
                        dates.push(new Date(new Date(element.date) - tzoffset).toISOString().slice(0, -5).replace(/T/, ' '))
                    }
                    else {
                        paramData.push(element[i.parameter]);
                        // dates.push(new Date(element.date).toISOString().replace(/T/, ' ').replace(/\..+/, ''))     // delete the dot and everything after)
                        dates.push(new Date(new Date(element.date) - tzoffset).toISOString().slice(0, -5).replace(/T/, ' '))
                        // dates.push(new Intl.DateTimeFormat("en-GB",{
                        //     year: "2-digit",
                        //     month: "2-digit",
                        //     day: "2-digit",
                        //     hour: 'numeric', minute: 'numeric', second: 'numeric'
                        // }).format(new Date(element.date)));
                    }
                }
            })
            chartData.push({
                labels: dates,
                datasets: [{
                    label: `${i.parameter} of ${name}`,
                    steppedLine: true,
                    data: paramData,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(45, 45, 46, 0.69)',
                    borderColor: 'rgba(45, 45, 46, 0.69)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(45, 45, 46, 0.69)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(45, 45, 46, 0.69)',
                    pointHoverBorderColor: 'rgba(45, 45, 46, 0.69)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10
                }]
            })
            setChartData(chartData);
        })
    },[ListGraphics, Data, Devices, tzoffset])

    const options = {
        scales: {
          xAxes: [{
                    ticks: {
                       reverse: false,
                       maxTicksLimit: 8,
                       fontSize: 10
                    },
                    gridLines: {
                        display:false
                    }
          }],
          yAxes: [{
              ticks: {
                maxTicksLimit: 5
              },
              gridLines: {
                display:true
              }
          }]
      }
    };

    function DeleteGraphic(parameter, friendly_name) {
        let ieeeAddr = '';
        Devices.map(device => device.friendly_name === friendly_name ? (
            ieeeAddr = device.ieeeAddr
        ) : false)
        socket.emit("DeleteGraphic", {device: ieeeAddr, parameter: parameter});
        // socket.emit("GETGRAPHICS")
    }

    return (
        <div>
            {/* <Title variant="h4">Graphics</Title> */}
            
            <AddGraphic socket={socket}/>
            <AddCalculation socket={socket} />
            {/* <CustomizedIconButton
                    component={Link}
                    size="small"
                    to="/graphics_settings"
                    aria-label="settings from graphics"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    startIcon={<SettingsIcon/>}
                >
                    Graphics Settings
            </CustomizedIconButton> */}
            {
                chartData.length ? (
                    <Grid container spacing={6} className={classes.grid}>
                                {
                                    chartData.map((n, index) => {
                                        return(
                                            <Grid item xs={12} md={6} lg={6} key={index}>
                                                <Paper className={classes.paper}>
                                                    <Grid container justify="flex-end" alignItems="flex-end">
                                                        <IconButton style={{color: 'black'}} onClick={() => DeleteGraphic((n.datasets[0].label).substring(0,(n.datasets[0].label).indexOf(' ')), (n.datasets[0].label).substring((n.datasets[0].label).indexOf('of ')+3,(n.datasets[0].label).length))}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Grid>
                                                    <Line key={index} data={n} options={options} />
                                                </Paper>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                ) : (
                    <div className={classes.sem}>
                        <Typography variant="h3">NO GRAPHICS TO SHOW</Typography>
                    </div>
                )
            }
            
        </div>
    )
}
