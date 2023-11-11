const express = require("express")
const router = express.Router()

const Joi = require("joi")
const { determineInvalidKey } = require("../../../src/express")

const passwordRegex = new RegExp("^[a-zA-Z0-9]{3,30}$")
const dbHelper = {
    account: require("../../../src/db/account")
}

router.post("/", (req, res) => {
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

module.exports = router
