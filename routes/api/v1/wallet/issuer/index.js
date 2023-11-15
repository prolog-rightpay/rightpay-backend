const express = require("express")
const { issuerFromBIN, issuerFromId, getAllIssuers, getAllIssuersPaymentMethods } = require("../../../../../src/db/wallet/global/issuer")
const { paymentMethodToJson } = require("../paymentmethod")
const router = express.Router()

function issuerToJSON(issuer) {
    return {
        id: issuer.id,
        name: issuer.name,
        thumbnail_image_url: issuer.thumbnailImageUrl,
        payment_methods: issuer.paymentMethods.map(item => paymentMethodToJson(item, false))
    }
}

router.get("/", async (req, res) => {
    const globalWalletDb = req.app.get("db").globalWallet
    const issuers = await getAllIssuers(globalWalletDb)
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
    // console.log(issuers)
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
        const issuer = await issuerFromId(globalWalletDb, id)
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

router.use("/new", require("./new"))

module.exports = router