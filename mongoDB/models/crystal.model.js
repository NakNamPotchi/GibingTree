const mongoose = require('mongoose');

const CrystalSchema = new mongoose.Schema({
    user: {
        type: String
    },
    balance: {
        type: String
    }
});

const Crystal = mongoose.model('Crystal', CrystalSchema);

module.exports = Crystal;
