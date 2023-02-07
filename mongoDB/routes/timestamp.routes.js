const TimestampController = require('../controllers/timestamp.controller');

module.exports = app => {
    app.get('/api/timestamps', TimestampController.findAllTimestamps);
    app.get('/api/timestamp/:id', TimestampController.findOneTimestamp);
    app.get('/api/timestamp/game/:game', TimestampController.findOneTimestampByGame);
    app.put('/api/timestamps/:id', TimestampController.updateTimestamp);
    app.post('/api/timestamp', TimestampController.createTimestamp);
    app.delete('/api/timestamp/:id', TimestampController.deleteTimestamp);
}
