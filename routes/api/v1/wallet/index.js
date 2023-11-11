const express = require("express")
const router = express.Router()

const { sessionAuth } = require("../../../../src/middleware/auth")
router.use("/", sessionAuth)

router.use("/issuer", require("./issuer/index"))

module.exports = router