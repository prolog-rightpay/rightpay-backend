const { v4: uuidv4 } = require("uuid")

/** Payment method (credit card) belonging to an account. */
class AccountPaymentMethod {
    /** @type {string} ID of the payment method. */
    id = null
    /** @type {string} Weak reference to parent account by ID. */
    accountId = null
    /** @type {string} Global payment method. */
    globalPaymentMethod = null
    
    /** @type {date} Date when the payment method was added. */
    dateAdded = null

    /** @type {number} 6-digit bin number of payment method. */
    bin = null
    /** @type {string?} User-facing and custom name of payment method. */
    name = null
    /** @type {string?} User note. */
    note = null

    /**
     * @param {string} [id=`uuidv4()`] If not given will create new UUIDv4.
     * @param {string} accountId 
     * @param {GlobalPaymentMethod} globalPaymentMethod 
     * @param {date} dateAdded If not given will use date of initialization.
     * @param {number} bin 
     * @param {string?} name 
     * @param {string?} note 
     */
    constructor(id, accountId, globalPaymentMethodId, bin, dateAdded = null, name = null, note = null) {
        this.id = id || uuidv4()
        this.accountId = accountId
        this.globalPaymentMethodId = globalPaymentMethodId
        this.bin = bin
        this.dateAdded = dateAdded || new Date()
        this.name = name
        this.note = note
    }
}
exports.AccountPaymentMethod = AccountPaymentMethod
