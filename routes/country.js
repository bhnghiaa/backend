const router = require("express").Router();
const countryController = require('../controllers/countryControllers');
const { verifyToken } = require("../middleware/jwt_token")

router.post('/', verifyToken, countryController.addCountry)
router.get('/', countryController.getCountries)
router.get('/:id', countryController.getCountry)
router.post('/places', countryController.addPlacesToCountry)
router.put('/:id', countryController.editCountry);
router.delete('/:id', countryController.deleteCountry);
module.exports = router;