const express = require("express")
const router = express.Router()

const bodyParser = require("body-parser")
router.use(bodyParser.json())

router.use("/v1", require("./v1/index"))

module.exports = router
