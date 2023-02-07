const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    axieID: {
        type: String
    },
    cost: {
        type: String
    }
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;
