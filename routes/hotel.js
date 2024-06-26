const router = require("express").Router();
const hotelController = require('../controllers/hotelControllers');
const { verifyToken } = require("../middleware/jwt_token")

router.post('/', verifyToken, hotelController.addHotel)
router.get('/', hotelController.getAllHotels)
router.get('/:id', hotelController.getHotelById)
router.get('/byCountry/:id', hotelController.getHotelsByCountry)
router.get('/search/:key', hotelController.search)
router.delete('/:id', hotelController.deleteHotel);
router.put('/:id', hotelController.editHotel);
module.exports = router;

