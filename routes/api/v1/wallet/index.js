const express = require("express")
const router = express.Router()

const { sessionAuth } = require("../../../../src/middleware/auth")
router.use("/", sessionAuth)

router.use("/issuer", require("./issuer/index"))
router.use("/paymentmethod", require("./paymentmethod/index").router)
router.use("/cashbackreward", require("./cashbackreward/index"))

module.exports = router