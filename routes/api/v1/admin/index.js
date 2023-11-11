const express = require("express")
const router = express.Router()

const { sessionAuth } = require("../../../../src/middleware/auth")
router.use("/", sessionAuth)
router.use("/", (req, res, next) => {
    const account = req.app.account
    if (account.isAdmin) {
        next()
    } else {
        res.status(403).json({
            success: false,
            message: "Invalid authorization"
        })
    }
})

router.use("/issuer", require("./issuer/index"))

module.exports = router