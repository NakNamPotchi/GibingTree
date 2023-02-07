const Crystal = require('../models/crystal.model');

module.exports.findAllCrystals = (req, res) => {
    Crystal.find()
        .then((allCrystals) => {
            res.json({ crystals: allCrystals })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports.findOneCrystal = (req, res) => {
    Crystal.findOne({ _id: req.params.id })
        .then(oneCrystal => {
            res.json({ crystal: oneCrystal })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.findOneCrystalByUserID = (req, res) => {
    Crystal.findOne({ user: req.params.userID })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}
        
module.exports.createCrystal = (req, res) => {
    Crystal.create(req.body)
    .then(newCrystal => {
            res.json({ crystal: newCrystal })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.updateCrystal = (req, res) => {
    console.log('req body',req.body)
    Crystal.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    )
        .then(updatedCrystal => {
            res.json({ crystal: updatedCrystal })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.updateCrystalByUserID = (req, res) => {
    console.log('req body',req.body)
    Crystal.findOneAndUpdate(
        { user: req.params.userID  },
        req.body,
        { new: true, runValidators: true }
        )
        .then(updatedCrystal => {
            res.json({ crystal: updatedCrystal })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteCrystal = (req, res) => {
    Crystal.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteCrystalByUserID = (req, res) => {
    Crystal.deleteOne({ user: req.params.userID })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}
