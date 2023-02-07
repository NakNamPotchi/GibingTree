const CrystalController = require('../controllers/crystal.controller');

module.exports = app => {
    app.get('/api/crystals', CrystalController.findAllCrystals);
    app.get('/api/crystal/:id', CrystalController.findOneCrystal);
    app.get('/api/crystal/userID/:userID', CrystalController.findOneCrystalByUserID);
    app.put('/api/crystals/:id', CrystalController.updateCrystal);
    app.put('/api/crystal/userID/:userID', CrystalController.updateCrystalByUserID);
    app.post('/api/crystal', CrystalController.createCrystal);
    app.delete('/api/crystal/:id', CrystalController.deleteCrystal);
    app.delete('/api/crystal/userID/:userID', CrystalController.deleteCrystalByUserID);
    
}
