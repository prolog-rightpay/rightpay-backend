const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")

const { GlobalIssuer } = require("../../../models/GlobalIssuer")

function issuerFromBSON(issuer) {
    const { id, name, thumbnail_image_url: thumbnailImageUrl, date_added: dateAdded } = issuer
    return new GlobalIssuer(id, name, dateAdded, thumbnailImageUrl)
}

async function binsFromIssuer(db, issuer) {
    const issuerBinsColl = db.collection("issuer_bins")
    const binDocsCur = await issuerBinsColl.find({ issuer_id: issuer.id })
    const binDocs = await binDocsCur.toArray()
    const bins = binDocs.map(bin => bin.bin)
    return bins
}
exports.binsFromIssuer = binsFromIssuer

async function getAllIssuers(db) {
    const issuersColl = db.collection("issuers")
    const issuersBSONCur = await issuersColl.find()
    const issuersBSON = await issuersBSONCur.toArray()
    const issuers = issuersBSON.map(issuerFromBSON)
    return issuers
}
exports.getAllIssuers = getAllIssuers

async function issuerFromBIN(db, bin) {
    const issuersColl = db.collection("issuers")
    const issuerBinsColl = db.collection("issuer_bins")

    const binDoc = await issuerBinsColl.findOne({ bin: bin })
    if (!binDoc) {
        throw new Error("BIN does not exist")
    }
    const issuerDoc = await issuersColl.findOne({ id: binDoc.issuer_id })
    if (!issuerDoc) {
        throw new Error("Issuer does not exist")
    }
    const issuer = issuerFromBSON(issuerDoc)
    return issuer
}
exports.issuerFromBIN = issuerFromBIN

async function issuerFromId(db, id) {
    const issuersColl = db.collection("issuers")
    const issuerDoc = await issuersColl.findOne({ id: id })
    if (!issuerDoc) {
        throw new Error("Issuer does not exist")
    }
    const issuer = issuerFromBSON(issuerDoc)
    return issuer
}
exports.issuerFromId = issuerFromId

async function insertGlobalIssuer(db, issuer) {
    const issuersColl = db.collection("issuers")
    const issuerBinsColl = db.collection("issuer_bins")
    
    const { id, name, thumbnailImageUrl, dateAdded } = issuer

    const existingIssuer = await issuersColl.findOne({ name: name })
    if (existingIssuer) {
        throw new Error("Issuer with name already exists")
    }

    const issuerBSON =  {
        id: id,
        name: name,
        thumbnail_image_url: thumbnailImageUrl,
        date_added: dateAdded
    }
    await issuersColl.insertOne(issuerBSON)

    // BINs
    const existingBinsCur = await issuerBinsColl.find({ bin: { $in: issuer.bins } })
    const existingBins = (await existingBinsCur.toArray()).map(bin => bin.bin)
    if (existingBins.length > 0) {
        console.log(`[warning] discarding matching bins: ${existingBins}`)
    }
    const filteredBins = issuer.bins.filter(bin => {
        return !existingBins.includes(bin)
    })

    if (filteredBins.length > 0) {
        const binsBSON = filteredBins.map(bin => {
            return {
                bin: bin,
                issuer_id: issuer.id
            }
        })
        await issuerBinsColl.insertMany(binsBSON)
    }
    
}
exports.insertGlobalIssuer = insertGlobalIssuer
