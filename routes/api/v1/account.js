const express = require("express")
const router = express.Router()

const Joi = require("joi")

const passwordRegex = new RegExp("^[a-zA-Z0-9]{3,30}$")
const dbHelper = {
    account: require("../../../src/db/account")
}

/**
 * Determine the first invalid key of a failed Joi schema validation.
 * @param {object} Joi error object, the `error` attribute of the object returned by `schema.validate()`. 
 * @returns {string|null} Invalid key string or null.
 */
function determineInvalidKey(error) {
    if (error.details.length < 1) {
        return null
    }
    const context = error.details[0].context.label
    return context
}

router.post("/signup", (req, res) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().pattern(passwordRegex).required(),
        first_name: Joi.string(),
        last_name: Joi.string()
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
    dbHelper.account.newAccount(accountsDb, {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.first_name,
        lastName: req.body.last_name
    })
    .then(result => {
        if (!result.success) {
            let message = "Account creation failure"
            if (result.error == "email_exists") { message = "Email already in use" }
            res.status(422).json({
                success: false,
                message: message
            })
            return
        }
        res.status(200).json({
            success: true,
            message: "Account created"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "A server error occurred"
        })
    })
})

router.post("/signin", async (req, res) => {
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
    
    console.log(passwordValidation)
    if (!passwordValidation.success) {
        res.status(422).json({
            success: false,
            message: "Invalid"
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
        session_token: sessionToken
    })
})

module.exports = router
