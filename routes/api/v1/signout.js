const express = require("express")
const router = express.Router()

const Joi = require("joi")

const dbHelper = {
    account: require("../../../src/db/account")
}

// /account endpoint requires session auth
const { sessionAuth } = require("../../../src/middleware/auth")
router.use("/", sessionAuth)

router.get("/", async (req, res) => {
    const sessionToken = req.app.session?.token
    if (!sessionToken) {
        res.status(403).json({
            success: false,
            message: "Missing authorization"
        })
        return
    }
    const accountsDb = req.app.get("db").accounts
    dbHelper.account.invalidateSessionToken(accountsDb, sessionToken)
    res.status(200).json({
        success: true
    })
})

module.exports = router
