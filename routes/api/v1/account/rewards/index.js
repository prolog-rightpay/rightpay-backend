const express = require("express")
const router = express.Router()

const { getPaymentMethod } = require("../../../../../src/db/wallet/global/paymentMethod")

const { sessionAuth } = require("../../../../../src/middleware/auth")
router.use("/", sessionAuth)

router.use("/search", require("./search"))

module.exports = router
