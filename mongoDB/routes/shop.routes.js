const ShopController = require('../controllers/shop.controller');

module.exports = app => {
    app.get('/api/shop', ShopController.findAllShops);
    app.get('/api/shop/:id', ShopController.findOneShop);
    app.get('/api/shop/axie/:axieID', ShopController.findOneShopByAxieID);
    app.put('/api/shop/:id', ShopController.updateShop);
    app.post('/api/shop', ShopController.createShop);
    app.delete('/api/shop/:id', ShopController.deleteShop);
}
