const { GlobalIssuer } = require("../../../models/GlobalIssuer")
const { GlobalPaymentMethod } = require("../../../models/GlobalPaymentMethod")

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
    const issuersDocCur = await issuersColl.find()
    const issuersDoc = await issuersDocCur.toArray()
    const issuers = issuersDoc.map(GlobalIssuer.fromDoc)
    return issuers
}
exports.getAllIssuers = getAllIssuers

async function getAllIssuersPaymentMethods(db) {
    const issuersColl = db.collection("issuers")
    const resultsCur = await issuersColl.aggregate([
        {
            $lookup: {
                from: "payment_methods",
                localField: "id",
                foreignField: "issuer_id",
                as: "payment_methods"
            }
        }
    ])
    const results = await resultsCur.toArray()
    const issuers = results.map(item => {
        const paymentMethods = item.payment_methods.map(GlobalPaymentMethod.fromDoc)
        const issuer = GlobalIssuer.fromDoc(item)
        issuer.paymentMethods = paymentMethods
        return issuer
    })
    return issuers
}
exports.getAllIssuersPaymentMethods = getAllIssuersPaymentMethods

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
    const issuer = GlobalIssuer.fromDoc(issuerDoc)
    return issuer
}
exports.issuerFromBIN = issuerFromBIN

async function issuerFromId(db, id, includeBINs = false) {
    const issuersColl = db.collection("issuers")
    const issuerDoc = await issuersColl.findOne({ id: id })
    if (!issuerDoc) {
        throw new Error("Issuer does not exist")
    }
    const issuer = GlobalIssuer.fromDoc(issuerDoc)

    if (includeBINs) {
        const bins = await binsFromIssuer(db, issuer)
        issuer.bins = bins
    }

    return issuer
}
exports.issuerFromId = issuerFromId

async function insertGlobalIssuer(db, issuer) {
    const issuersColl = db.collection("issuers")
    const issuerBinsColl = db.collection("issuer_bins")
    
    const { id, name, thumbnailImageUrl, dateAdded, bins } = issuer

    const existingIssuer = await issuersColl.findOne({ name: name })
    if (existingIssuer) {
        throw new Error("Issuer with name already exists")
    }

    const issuerDoc =  {
        id: id,
        name: name,
        thumbnail_image_url: thumbnailImageUrl,
        date_added: dateAdded
    }
    await issuersColl.insertOne(issuerDoc)

    // BINs
    const existingBinsCur = await issuerBinsColl.find({ bin: { $in: bins } })
    const existingBins = (await existingBinsCur.toArray()).map(bin => bin.bin)
    if (existingBins.length > 0) {
        console.log(`[warning] discarding matching bins: ${existingBins}`)
    }
    const filteredBins = bins.filter(bin => {
        return !existingBins.includes(bin)
    })

    if (filteredBins.length > 0) {
        const binsDoc = filteredBins.map(bin => {
            return {
                bin: bin,
                issuer_id: id
            }
        })
        await issuerBinsColl.insertMany(binsDoc)
    }
    
}
exports.insertGlobalIssuer = insertGlobalIssuer

async function updateGlobalIssuer(db, issuer) {
    const issuersColl = db.collection("issuers")
    const issuerBinsColl = db.collection("issuer_bins")

    const { id, name, thumbnailImageUrl, bins } = issuer
    const result = await issuersColl.updateOne({ id }, {
        $set: {
            name, thumbnail_image_url: thumbnailImageUrl, date_modified: new Date()
        }
    })
    if (result.matchedCount < 1) {
        throw new Error("Issuer not found.")
    }

    // BINs
    const binsCur = await issuerBinsColl.find({ issuer_id: id })
    const existingBins = await binsCur.toArray()

    const binsToDelete = existingBins.filter(bin => { return !bins.includes(bin.bin) }).map(doc => { return { _id: doc._id } })
    if (binsToDelete.length > 0) {
        await issuerBinsColl.deleteMany({ $or: binsToDelete })
    }

    const operations = bins.map(async bin => {
        return await issuerBinsColl.updateOne({ bin: bin }, { $set: { issuer_id: id } }, { upsert: true })
    })
    await Promise.all(operations)
}
exports.updateGlobalIssuer = updateGlobalIssuer

