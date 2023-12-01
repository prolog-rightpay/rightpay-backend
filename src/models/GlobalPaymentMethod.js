const { v4: uuidv4 } = require("uuid")

/** Global, generic, payment method that contains no user info. */
class GlobalPaymentMethod {
    /** @type {string} UUID of the payment method. */
    id = null
    /** @type {string} `credit` */
    paymentType = "credit"

    /** @type {string} ID of the network type, `visa`, `mastercard`, `amex`, `discover` */
    networkType = null

    /** @type {date} Date that the payment method was created. */
    dateCreated = null
    /** @type {date?} Date that the payment method was last modified. */
    dateModified = null

    /** @type {string} User facing name of the card. */
    name = null
    /** @type {boolean} Is card active and should be shown to user. */
    active = null
    /** @type {string?} Image URL of card front. */
    imageUrl = null

    /** @type {GlobalPaymentMethodIssuer} Issuer of the card, e.g. American Express. */
    issuerId = null
    /** @type {[CashbackReward]} Array of available cashback rewards, active or not. */
    cashbackRewards = []

    /**
     * @param {string}} id If not given will create new UUIDv4.
     * @param {string} paymentType 
     * @param {string} networkType 
     * @param {string} name 
     * @param {string} issuerId 
     * @param {string?} imageUrl 
     * @param {date?} dateCreated If not given then will use date of initialization.
     * @param {date?} dateModified 
     * @param {boolean?} [active=true]
     */
    constructor(id, paymentType, networkType, name, issuerId, imageUrl = null, dateCreated = null, dateModified = null, active = true) {
        this.id = id || uuidv4()
        this.paymentType = paymentType
        this.networkType = networkType

        this.dateCreated = dateCreated || new Date()
        this.dateModified = dateModified

        this.name = name
        this.imageUrl = imageUrl
        this.issuerId = issuerId

        this.active = active
    }

    static fromDoc(doc) {
        const { id, payment_type: paymentType, network_type: networkType,
        date_created: dateCreated, date_modified: dateModified, name, active,
        image_url: imageUrl, issuer_id: issuerId } = doc
    
        const paymentMethod = new GlobalPaymentMethod(id, paymentType, networkType, name, issuerId, imageUrl, dateCreated, dateModified, active)
        return paymentMethod
    }

    toJson(extended = false) {
        const { id, issuerId, name, imageUrl, paymentType, cashbackRewards } = this
        let json = {
            id: id,
            issuer_id: issuerId,
            name: name,
            image_url: imageUrl,
            payment_type: paymentType,
            cashback_rewards: cashbackRewards.map(cr => cr.toJson(extended))
        }
    
        if (extended) {
            const { paymentType, networkType, dateCreated, dateModified } = this
            json.payment_type = paymentType
            json.network_type = networkType
            json.date_created = dateCreated
            json.date_modified = dateModified
        }
        return json
    }
}
exports.GlobalPaymentMethod = GlobalPaymentMethod
