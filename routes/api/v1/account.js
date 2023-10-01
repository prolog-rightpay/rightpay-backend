const express = require("express")
const router = express.Router()

const Joi = require("joi")

const passwordRegex = new RegExp("^[a-zA-Z0-9]{3,30}$")

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
        password: Joi.string().pattern(passwordRegex).required()
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
    res.status(200).json({
        success: true,
        message: "Account created"
    })
})

router.post("/signin", (req, res) => {
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
    res.status(200).json({
        success: true,
        message: "Logged in",
        session_token: "xxx"
    })
})

module.exports = router
