const moongose = require('mongoose');

const Schema = moongose.Schema;

const eventSchema = new Schema({
    device_id: {
        type: String
    },
    battery: {
        type: Number
    },
    voltage: {
        type: Number
    },
    temperature: {
        type: Number
    },
    humidity: {
        type: Number
    },
    pressure: {
        type: Number
    },
    state: {
        type: String
    },
    power: {
        type: Number
    },
    voltage: {
        type: Number
    },
    current: {
        type: Number
    },
    consumption: {
        type: Number
    },
    brightness: {
        type: Number
    },
    color_temp: {
        type: Number
    },
    color: {
        type: Object
    },
    occupancy: {
        type: String
    },
    date: {
        type: Date
    },
    linkquality: {
        type: Number
    },
    Last_Time: {
        type: String
    },
})

module.exports = moongose.model('Measurements', eventSchema);