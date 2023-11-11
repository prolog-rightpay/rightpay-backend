const { v4: uuidv4 } = require("uuid")

/** Global, generic, payment method that contains no user info. */
class GlobalPaymentMethod {
    /** @type {string} UUID of the payment method. */
    id = null
    /** @type {string} `credit` */
    paymentType = "credit"

    /** @type {[number]} Array of 6-digit bin numbers associated with this card. */
    bin = []
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
     */
    constructor(id, paymentType, networkType, name, issuerId, imageUrl = null, dateCreated = null, dateModified = null) {
        this.id = id || uuidv4()
        this.paymentType = paymentType
        this.networkType = networkType

        this.dateCreated = dateCreated || new Date()
        this.dateModified = dateModified

        this.name = name
        this.imageUrl = imageUrl
        this.issuerId = issuerId
    }
}
exports.GlobalPaymentMethod = GlobalPaymentMethod
