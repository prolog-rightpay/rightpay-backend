const { issuerFromId } = require("./issuer")

async function insertGlobalPaymentMethod(db, globalPaymentMethod) {
    const { id, paymentType, networkType,
        dateCreated, dateModified,
        name, active, imageUrl, issuerId } = globalPaymentMethod

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
