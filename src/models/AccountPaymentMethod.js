class AccountPaymentMethod {
    /** @type {string} ID of the payment method. */
    id = null
    /** @type {string} Weak (non-circular) reference to parent account by ID. */
    accountId = null
    /** @type {GlobalPaymentMethod} Global payment method. */
    globalPaymentMethod = null
    
    /** @type {date} Date when the payment method was added. */
    dateAdded = null

    /** @type {number} 6-digit bin number of payment method. */
    bin = null
    /** @type {string} User-facing and custom name of payment method. */
    name = null
    /** @type {string?} User note. */
    note = null

}