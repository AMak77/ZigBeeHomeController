const moongose = require('mongoose');

const Schema = moongose.Schema;

const eventSchema = new Schema({
    device: {
        type: String
    },
    parameter: {
      type: String
    }
})

module.exports = moongose.model('Graphics', eventSchema);
