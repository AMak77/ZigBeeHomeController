import React from 'react';
import State from './parameters/State';
import Brightness from './parameters/Brightness';
import ColorTemperature from './parameters/Color_temp';
import Color from './parameters/Color';

const DevicesParameters = require("./parameters/parameter.json");

export default function ChangeParameters(props) {
    const socket = props.socket;
    const DeviceParameters = DevicesParameters.filter(device => device.model === props.model);

    // const data = props.data;

    return(
        <div>
            {DeviceParameters.map(item => (
                <div key={item.model}>
                    {item.state ? <State id={props.id} socket={socket} /> : false}
                    {item.brightness ? <Brightness id={props.id} socket={socket} /> : false}
                    {item.color_temp ? <ColorTemperature id={props.id} socket={socket} /> : false}
                    {item.color_xy ? <Color id={props.id} socket={socket} /> : false}
                </div>
            ))}
        </div>
    )
}
