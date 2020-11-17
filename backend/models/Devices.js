const moongose = require('mongoose');

const Schema = moongose.Schema;

const eventSchema = new Schema({
    ieeeAddr: {
        type: String
    },
    type: {
        type: String
    },
    networkAddress: {
        type: Number
    },
    model: {
        type: String
    },
    vendor: {
        type: String
    },
    description: {
        type: String
    },
    friendly_name: {
        type: String
    },
    manufacturerID: {
        type: Number
    },
    manufacturerName: {
        type: String
    },
    powerSource: {
        type: String
    },
    modelID: {
        type: String
    },
    hardwareVersion: {
        type: Number
    },
    softwareBuildID: {
        type: String
    },
    dateCode: {
        type: String
    },
    lastSeen: {
        type: Number
    } ,
    division: {
        type: String
    }     
});

module.exports = moongose.model('Devices', eventSchema);