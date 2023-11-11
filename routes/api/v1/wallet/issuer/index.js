const express = require("express")
const { issuerFromBIN, issuerFromId, getAllIssuers } = require("../../../../../src/db/wallet/global/issuer")
const router = express.Router()

function issuerToJSON(issuer) {
    return {
        id: issuer.id,
        name: issuer.name,
        thumbnail_image_url: issuer.thumbnailImageUrl
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