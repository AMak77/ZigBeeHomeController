const moongose = require('mongoose');

const Schema = moongose.Schema;

const eventSchema = new Schema({
    date: {
        type: String
    },
    sensor: {
        type: String
    },
    conditionParameter: {
        type: String
    },
    conditionOperator: {
        type: String
    },
    conditionState: {
        type: String
    },
    atuator: {
        type: String
    },
    thenParameter: {
        type: String
    },
    thenState: {
        type: String
    },
    state: {
        type: Boolean
    }
})

module.exports = moongose.model('Scenes', eventSchema);