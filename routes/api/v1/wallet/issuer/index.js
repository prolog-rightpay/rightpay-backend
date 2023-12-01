const express = require("express")
const Joi = require("joi")
const { issuerFromBIN, issuerFromId, getAllIssuers, getAllIssuersPaymentMethods, binsFromIssuer, updateGlobalIssuer } = require("../../../../../src/db/wallet/global/issuer")
const { getPaymentMethodsForIssuer, paymentMethodToJson } = require("../../../../../src/db/wallet/global/paymentmethod")
const { determineInvalidKey } = require("../../../../../src/express")
const { GlobalIssuer } = require("../../../../../src/models/GlobalIssuer")
const router = express.Router()

function issuerToJSON(issuer) {
    const data = {
        id: issuer.id,
        name: issuer.name,
        thumbnail_image_url: issuer.thumbnailImageUrl,
        payment_methods: issuer.paymentMethods.map(item => paymentMethodToJson(item, false)),
        bins: issuer.bins
    }
    if (!issuer.bins) {
        delete issuer.bins
    }
    return data
}

router.get("/", async (req, res) => {
    const globalWalletDb = req.app.get("db").globalWallet
    let issuers = await getAllIssuers(globalWalletDb)

    issuers = await Promise.all(issuers.map(async issuer => {
        const paymentMethods = await getPaymentMethodsForIssuer(globalWalletDb, issuer)
        issuer.paymentMethods = paymentMethods
        return issuer
    }))

    const extendedQuery = req.query.extended
    const extended = req.app.account.isAdmin && extendedQuery != null
    if (extended) {
        issuers = await Promise.all(issuers.map(async issuer => {
            issuer["bins"] = await binsFromIssuer(globalWalletDb, issuer)
            return issuer
        }))
    }
    const issuersJson = issuers.map(issuerToJSON)

    res.json({
        success: true,
        data: {
            issuers: issuersJson
        }
    })
})

router.get("/paymentmethods", async (req, res) => {
    const globalWalletDb = req.app.get("db").globalWallet
    const issuers = await getAllIssuersPaymentMethods(globalWalletDb)
    res.json({
        success: true,
        data: {
            issuers: issuers.map(issuerToJSON)
        }
    })
})

router.get("/bin/:bin", async (req, res) => {
    const { bin } = req.params
    if (!bin) {
        res.status(422).json({
            success: false,
            message: "Missing BIN"
        })
    }
    const globalWalletDb = req.app.get("db").globalWallet
    try {
        const issuer = await issuerFromBIN(globalWalletDb, bin)
        res.json({
            success: true,
            data: {
                issuer: issuerToJSON(issuer)
            }
        })
    } catch (err) {
        res.status(422).json({
            success: false,
            message: err.message
        })
    }
    
})

router.get("/id/:id", async (req, res) => {
    const { id } = req.params
    if (!id) {
        res.status(422).json({
            success: false,
            message: "Missing ID"
        })
    }
    const globalWalletDb = req.app.get("db").globalWallet
    try {
        const extendedQuery = req.query.extended
        const extended = req.app.account.isAdmin && extendedQuery != null
        const issuer = await issuerFromId(globalWalletDb, id, extended)
        res.json({
            success: true,
            data: {
                issuer: issuerToJSON(issuer)
            }
        })
    } catch (err) {
        res.status(422).json({
            success: false,
            message: err.message
        })
    }
    
})

router.put("/id/:id", async (req, res) => {
    const { id } = req.params
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

    const { name, thumbnail_image_url: thumbnailImageUrl, bins } = req.body
    const issuer = new GlobalIssuer(id, name, null, thumbnailImageUrl)
    issuer.bins = bins

    const globalWalletDb = req.app.get("db").globalWallet
    try {
        await updateGlobalIssuer(globalWalletDb, issuer)
        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.status(422).json({
            success: false,
            message: err.message
        })
    }
    
})

router.use("/new", require("./new"))

module.exports = router
