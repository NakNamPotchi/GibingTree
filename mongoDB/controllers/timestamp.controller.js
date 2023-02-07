const Timestamp = require('../models/timestamp.model');

module.exports.findAllTimestamps = (req, res) => {
    Timestamp.find()
        .then((allTimestamps) => {
            res.json({ timestamps: allTimestamps })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });
}

module.exports.findOneTimestamp = (req, res) => {
    Timestamp.findOne({ _id: req.params.id })
        .then(oneTimestamp => {
            res.json({ timestamp: oneTimestamp })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.findOneTimestampByGame = (req, res) => {
    Timestamp.findOne({ user: req.params.userID })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}
        
module.exports.createTimestamp = (req, res) => {
    Timestamp.create(req.body)
    .then(newTimestamp => {
            res.json({ timestamp: newTimestamp })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.updateTimestamp = (req, res) => {
    console.log('req body',req.body)
    Timestamp.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    )
        .then(updatedTimestamp => {
            res.json({ timestamp: updatedTimestamp })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

module.exports.deleteTimestamp = (req, res) => {
    Timestamp.deleteOne({ _id: req.params.id })
        .then(result => {
            res.json({ result: result })
        })
        .catch((err) => {
            res.json({ message: 'Something went wrong', error: err })
        });}

