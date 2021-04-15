const router = require("express").Router();
const controller = require("./flips.controller");

router.route("/").get(controller.list);

module.exports = router;