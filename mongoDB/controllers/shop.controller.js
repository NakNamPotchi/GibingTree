const Shop = require('../models/shop.model');

module.exports.findAllShops = (req, res) => {
    Shop.find()
        .then((allShops) => {
            res.json({ shops: allShops })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports.findOneShop = (req, res) => {
    Shop.findOne({ _id: req.params.id })
        .then(oneShop => {
            res.json({ shop: oneShop })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.findOneShopByAxieID = (req, res) => {
    Shop.findOne({ axieID: req.params.axieID })
        .then(oneShop => {
            res.json({ shop: oneShop })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.createShop = (req, res) => {
    Shop.create(req.body)
    .then(newShop => {
            res.json({ shop: newShop })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.updateShop = (req, res) => {
    console.log('req body',req.body)
    Shop.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    )
        .then(updatedShop => {
            res.json({ shop: updatedShop })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteShop = (req, res) => {
    Shop.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}
