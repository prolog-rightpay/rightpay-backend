const express = require("express")
const router = express.Router()

const Joi = require("joi")

const dbHelper = {
    account: require("../../../src/db/account")
}

router.post("/", async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    const validate = schema.validate(req.body)

    if (validate.error != null) {
        let message = "Invalid signup data"
        const invalidKey = determineInvalidKey(validate.error)
        if (invalidKey) {
            message = "Invalid " + invalidKey
        }
        res.status(422).json({
            success: false,
            message: message
        })
        return
    }

    const accountsDb = req.app.get("db").accounts

    let passwordValidation
    try {
        passwordValidation = await dbHelper.account.validatePassword(accountsDb, req.body.email, req.body.password)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        return e
    }
    
    if (!passwordValidation.success) {
        res.status(422).json({
            success: false,
            message: "Invalid email or password."
        })
        return
    }

    const account = passwordValidation.account
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress

    let sessionToken
    try {
        sessionToken = await dbHelper.account.newSessionToken(accountsDb, account.id, ip, "api.signin")
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        return
    }

    res.status(200).json({
        success: true,
        data: {
            session_token: sessionToken
        }
    })
})

module.exports = router
