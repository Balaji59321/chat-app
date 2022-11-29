const express =  require("express");
const protect = require("../authMiddleware");
const {accessChat,fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup} = require("../controllers/chatController");

const route = express.Router();

route.route("/").post(protect, accessChat);
route.route("/").get(protect, fetchChat);
route.route("/group").post(protect,createGroupChat);
route.route("/rename").put(protect,renameGroup);
route.route("/groupremove").put(protect,removeFromGroup);
route.route("/groupadd").put(protect,addToGroup );


module.exports = route;