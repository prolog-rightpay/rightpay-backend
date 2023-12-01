const { GlobalPaymentMethod } = require("../../../models/GlobalPaymentMethod")
const { issuerFromId } = require("./issuer")

function paymentMethodFromBson(bson) {
    const { id, payment_type: paymentType, network_type: networkType,
    date_created: dateCreated, date_modified: dateModified, name, active,
    image_url: imageUrl, issuer_id: issuerId } = bson

    const paymentMethod = new GlobalPaymentMethod(id, paymentType, networkType, name, issuerId, imageUrl, dateCreated, dateModified, active)
    return paymentMethod
}
exports.paymentMethodFromBson = paymentMethodFromBson

function paymentMethodToBson(paymentMethod) {
    const { id, paymentType, networkType, dateCreated, dateModified, name, active, imageUrl, issuerId } = paymentMethod

    const bson = {
        id: id,
        payment_type: paymentType,
        network_type: networkType,
        date_created: dateCreated,
        date_modified: dateModified,
        name: name,
        active: active,
        image_url: imageUrl,
        issuer_id: issuerId
    }

    return bson
}

async function insertGlobalPaymentMethod(db, globalPaymentMethod) {
    const { id, paymentType, networkType, name, issuerId } = globalPaymentMethod

    switch (paymentType) {
        case "credit":
            break
        default:
            throw new Error("Invalid payment type")
    }
    switch (networkType) {
        case "visa":
        case "mastercard":
        case "amex":
        case "discover":
            break
        default:
            throw new Error("Invalid network type")
    }

    // Check that issuer exists
    const _ = await issuerFromId(db, issuerId)
    const bson = paymentMethodToBson(globalPaymentMethod)

    const paymentMethodsColl = db.collection("payment_methods")

    const existing = await paymentMethodsColl.findOne({
        $or: [
            { id: id },
            { issuer_id: issuerId, name: name }
        ]
    })
    if (existing) {
        throw new Error("Payment method already exists")
    }

    await paymentMethodsColl.insertOne(bson)
}
exports.insertGlobalPaymentMethod = insertGlobalPaymentMethod

async function getPaymentMethods(db) {
    const paymentMethodsColl = db.collection("payment_methods")
    const resultsCur = paymentMethodsColl.find()
    const results = await resultsCur.toArray()
    const paymentMethods = results.map(paymentMethodFromBson)
    return paymentMethods
} 
exports.getPaymentMethods = getPaymentMethods

async function getPaymentMethodsForIssuer(db, issuer) {
    const paymentMethodsColl = db.collection("payment_methods")
    const resultsCur = paymentMethodsColl.find({ issuer_id: issuer.id })
    const results = await resultsCur.toArray()
    const paymentMethods = results.map(paymentMethodFromBson)
    return paymentMethods
}
exports.getPaymentMethodsForIssuer = getPaymentMethodsForIssuer

function paymentMethodToJson(paymentMethod, includeIssuerId = true) {
    const { id, issuerId, name, imageUrl, paymentType } = paymentMethod
    let json = {
        id: id,
        issuer_id: issuerId,
        name: name,
        image_url: imageUrl,
        payment_type: paymentType
    }
    if (!includeIssuerId) {
        delete json.issuer_id
    }
    return json
}
exports.paymentMethodToJson = paymentMethodToJson
