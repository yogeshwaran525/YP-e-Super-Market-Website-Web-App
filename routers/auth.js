const express = require("express");
const controller = require("../controller/purchase");
const router = express.Router();


// router.post("/login", userController.login);


router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", controller.login);


module.exports = router;