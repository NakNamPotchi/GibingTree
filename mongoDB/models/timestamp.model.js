const mongoose = require('mongoose');

const TimestampSchema = new mongoose.Schema({
    game: {
        type: String
    },
    time: {
        type: String
    }
});

const Timestamp = mongoose.model('Timestamp', TimestampSchema);

module.exports = Timestamp;
