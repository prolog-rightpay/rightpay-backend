const express = require("express")
const router = express.Router()

router.use("/signin", require("./signin"))
router.use("/signup", require("./signup"))
router.use("/signout", require("./signout"))
router.use("/account", require("./account"))
router.use("/admin", require("./admin"))

module.exports = router