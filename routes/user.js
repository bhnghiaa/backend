const router = require("express").Router();
const userController = require('../controllers/userController')
const {verifyToken} = require("../middleware/jwt_token")

router.delete('/',verifyToken, userController.deleteUser)
router.get('/',verifyToken,userController.getUser)

module.exports = router;