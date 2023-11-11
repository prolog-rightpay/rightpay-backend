const { v4: uuidv4 } = require("uuid")

/**
 * Transaction and associated metadata (most importantly the cashback reward).
 */
class AccountTransaction {
    /** @type {string} UUIDv4 */
    id = null
    /** @type {date} Date transaction occurred. */
    dateOccurred = null
    /** @type {string} Weak-reference account ID of the account. */
    accountId = null
    /** @type {string?} Weak-reference account-specific payment method used.  */
    accountPaymentMethodId = null
    /** @type {string?} Weak-reference cashback reward used. */
    cashbackRewardId = null

    /** @type {number?} Total amount spent in transaction.  */
    total = null
    /** @type {number?} Calculated amount saved in transaction from cashback reward. */
    savings = null

    /**
     * @param {string} id If not given will create new UUIDv4.
     * @param {string?} accountId
     * @param {date} dateOccurred If not given will use date of initialization.
     * @param {string?} accountPaymentMethodId 
     * @param {string?} cashbackRewardId 
     * @param {number?} total 
     * @param {nunber?} savings 
     */
    constructor(id,
        accountId,
        dateOccurred = null,
        accountPaymentMethodId = null,
        cashbackRewardId = null,
        total = null,
        savings = null) {

        this.id = id || uuidv4()
        this.accountId = accountId
        this.dateOccurred = dateOccurred || new Date()
        this.accountPaymentMethodId = accountPaymentMethodId
        this.cashbackRewardId = cashbackRewardId
        this.total = total
        this.savings = savings
    }
}
exports.AccountTransaction = AccountTransaction
