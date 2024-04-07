const router = require("express").Router();
const hotelController = require('../controllers/hotelControllers');
const {verifyToken} = require("../middleware/jwt_token")

router.post('/',verifyToken, hotelController.addHotel)
router.get('/:id', hotelController.getHotelById)
router.get('/byCountry/:id', hotelController.getHotelsByCountry)
router.get('/search/:key', hotelController.search)

module.exports = router;

