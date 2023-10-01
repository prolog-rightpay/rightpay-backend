const express = require("express")
const router = express.Router()

const Joi = require("joi")
const dbHelper = {
    account: require("../../../src/db/account")
}

router.use("/", async (req, res, next) => {
    const accountsDb = req.app.get("db").accounts

    const authHeader = req.headers["authorization"]
    const bearer = "Bearer "
    if (!authHeader.startsWith(bearer)) {
        res.status(403).json({
            success: false,
            message: "Missing authorization"
        })
        return
    }
    const sessionToken = authHeader.slice(bearer.length)

    console.log(sessionToken)
    let validatedAccount
    try {
        validatedAccount = await dbHelper.account.validateSessionToken(accountsDb, sessionToken)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        return
    }
    if (!validatedAccount) {
        res.status(403).json({
            success: false,
            message: "Invalid authorization"
        })
        return
    }
    req.app.account = validatedAccount
    next()
})

router.get("/", (req, res) => {
    const account = req.app.account
    const accountData = {
        id: account.id,
        email: account.email,
        first_name: account.firstName,
        last_name: account.lastName,
        date_created: account.dateCreated?.toISOString()
    }
    res.json({
        success: true,
        account: accountData
    })
})

module.exports = router
