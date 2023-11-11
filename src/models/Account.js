class Account {
    /** @type {string} UUID of account. */
    id = null
    /** @type {string} Email of user. */
    email = null
    /** @type {string} First name of user. */
    firstName = null
    /** @type {string} Last name of user. */
    lastName = null
    /** @type {data} Date that the user account was created. */
    dateCreated = null

    constructor(id, email) {
        this.id = id
        this.email = email
    }
}
exports.Account = Account
