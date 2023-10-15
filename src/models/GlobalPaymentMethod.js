/** Global, generic, payment method that contains no user info. */
class GlobalPaymentMethod {
    /** @type {string} UUID of the payment method. */
    id = null
    /** @type {string} `credit` */
    paymentType = "credit"

    /** @type {[number]} Array of 6-digit bin numbers associated with this card. */
    bin = null
    /** @type {string} ID of the network type, `visa`, `mastercard`, `amex`, `discover` */
    networkType = null

    /** @type {date} Date that the payment method was created. */
    dateCreated = null
    /** @type {date} Date that the payment method was last modified. */
    dateModified = null
    /** @type {string} User facing name of the card. */
    name = null
    /** @type {boolean} Is card active and should be shown to user. */
    active = null
    /** @type {string} Image URL of card front. */
    imageUrl = null

    /** @type {GlobalPaymentMethodIssuer} Issuer of the card, e.g. American Express. */
    issuer = null
    /** @type {[CashbackPromotion]} Array of available cashback promotions, active or not. */
    cashbackPromotions = []
}
exports.GlobalPaymentMethod = GlobalPaymentMethod
