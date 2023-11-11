const { v4: uuidv4 } = require("uuid")

class Account {
    /** @type {string} UUID of account. */
    id = null
    /** @type {string} Email of user. */
    email = null
    /** @type {string} First name of user. */
    firstName = null
    /** @type {string} Last name of user. */
    lastName = null
    /** @type {date} Date that the user account was created. */
    dateCreated = null
    /** @type {boolean} Does account have admin privileges? Cannot be set through code.  */
    isAdmin = null

    /**
     * @param {string?} id If not given will create new UUIDv4.
     * @param {string} email 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {date?} dateCreated If not given will use date of initialization.
     * @param {boolean} [isAdmin=false]
     */
    constructor(id, email, firstName, lastName, dateCreated = null, isAdmin = false) {
        this.id = id || uuidv4()
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.dateCreated = dateCreated || new Date()
        this.isAdmin = isAdmin
    }
}
exports.Account = Account
