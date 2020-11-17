const moongose = require('mongoose');

const Schema = moongose.Schema;

const eventSchema = new Schema({
    name: {
        type: String
    }
})

module.exports = moongose.model('Divisions', eventSchema);