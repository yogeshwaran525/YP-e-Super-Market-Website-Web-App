const express = require("express");
const controller = require("../controller/purchase");
const router = express.Router();
// Form Login ,createaccount and Profile actions are carried out and post in page
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/profile", controller.login);
router.get("/logout", controller.logout);
router.post("/purchaseItem", controller.purchaseItem);

module.exports = router;