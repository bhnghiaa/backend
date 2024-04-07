const router = require("express").Router();
const reviewController = require('../controllers/reviewCOntroller')
const {verifyToken} = require("../middleware/jwt_token")

router.post('/',verifyToken, reviewController.addReview)
router.get('/:id',reviewController.getReviews)

module.exports = router;