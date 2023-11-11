const express = require("express")
const router = express.Router()

const Joi = require("joi")
const { validatePassword, insertSession } = require("../../../src/db/account")
const { determineInvalidKey } = require("../../../src/express")
const { Session } = require("../../../src/models/Session")

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
        passwordValidation = await validatePassword(accountsDb, req.body.email, req.body.password)
        
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

    try {
        const session = new Session(account.id, ip, "api.signin")
        await session.generateToken()
        await insertSession(accountsDb, session)

        res.status(200).json({
            success: true,
            data: {
                session_token: session.token
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        return
    }
})

module.exports = router
