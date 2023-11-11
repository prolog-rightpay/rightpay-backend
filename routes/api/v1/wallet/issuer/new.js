const express = require("express")
const Joi = require("joi")
const { insertGlobalIssuer } = require("../../../../../src/db/wallet/global/issuer")
const { determineInvalidKey } = require("../../../../../src/express")
const { isAdmin } = require("../../../../../src/middleware/admin")
const { GlobalIssuer } = require("../../../../../src/models/GlobalIssuer")
const router = express.Router()

router.use("/", isAdmin)

// /account endpoint requires session auth

router.post("/", async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        thumbnail_image_url: Joi.string(),
        bins: Joi.array().items(Joi.string().regex(/^\d{6}$/)).required()
    })
    const validate = schema.validate(req.body)

    if (validate.error != null) {
        let message = "Invalid data"
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

    const { name, date_added: dateAdded, thumbnail_image_url: thumbnailImageUrl, bins } = req.body
    const issuer = new GlobalIssuer(null, name, dateAdded, thumbnailImageUrl)
    issuer.bins = bins

    const globalWalletDb = req.app.get("db").globalWallet
    try {
        await insertGlobalIssuer(globalWalletDb, issuer)
        res.json({
            success: true
        })
    } catch (err) {
        res.status(422).json({
            success: false,
            message: err.message
        })
    }
    
})

module.exports = router
