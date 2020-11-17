import React from 'react'

export default function DataDevice(props) {
    const data = props.data;

    const tzoffset = (new Date()).getTimezoneOffset() * 60000;

    const DataFromDevice = data.filter(device => device.device_id === props.id).splice(0,1);

    return (
        <div>
            {
                DataFromDevice.map(item => (
                        <div key={item.device_id}>
                            {item.state ? (item.state) : false}
                            {item.brightness > -1 ? (<p>brightness: {(item.brightness*100/254).toFixed(0)}%</p>) : false}
                            {item.color_temp > -1 ? (<p>color_temp: {(item.color_temp*100/510).toFixed(0)}%</p>) : false}
                            {item.power > -1 ? <p>Power: {item.power}W</p> : false}
                            {item.voltage > -1 ? (item.voltage > 1000 ? (<p>Voltage: {item.voltage} mV</p>) : (<p>Voltage: {item.voltage} V</p>) ) : false}
                            {item.current > -1 ? <p>Current: {item.current}A</p> : false}
                            {item.battery > -1 ? <p>Battery: {item.battery}%</p> : false}
                            {item.consumption > -1 ? <p>Consumption: {item.consumption}W</p> : false}
                            {item.temperature > -1 ? <p>Temperature: {item.temperature}ºC</p> : false}
                            {item.humidity > -1 ? <p>Humidity: {item.humidity}%</p> : false}
                            {item.pressure > -1 ? <p>Pressure: {item.pressure}mBar</p> : false}
                            {item.occupancy === "true" ? <h3>Occupancy</h3> : false}
                            {item.occupancy === "false" ? <h3>NO Occupancy</h3> : false}
                            {item.date ? <h6>{new Date(new Date(item.date) - tzoffset).toISOString().slice(0, -5).replace(/T/, ' ')}</h6> : false}
                        </div>
                ))
            }
        </div>
    )
}
