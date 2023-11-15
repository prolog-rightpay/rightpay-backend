const express = require("express")
const router = express.Router()

router.use("/new", require("./new"))

module.exports = router