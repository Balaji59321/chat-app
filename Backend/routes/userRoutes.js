const express = require("express");
const {allUsers,registerUser,authUser} = require("./../controllers/userController");
const protect = require("./../authMiddleware");

const router = express.Router();

router.route("/").get(protect,allUsers);
router.post("/",registerUser)
router.post("/signup",authUser);

module.exports = router;