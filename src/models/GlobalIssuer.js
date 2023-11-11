const { v4: uuidv4 } = require("uuid")

/** Issuer of payment methods, e.g. Chase or American Express. Not to be confused with network such as Visa or Mastercard. */
class GlobalIssuer {
    /** @type {string} UUID of the issuer. */
    id = null
    /** @type {[number]} Array of 6-digit bins */
    bins = null
    /** @type {string} User-facing name of the issuer, e.g. `Chase` */
    name = null
    /** @type {string?} URL of a square thumbnail image. */
    thumbnailImageUrl = null
    /** @type {date} Date added. */
    dateAdded = null

    /**
     * @param {string?} id If not given will create new UUIDv4.
     * @param {string} name 
     * @param {date?} dateAdded If not given will use date of initialization.
     * @param {string?} thumbnailImageUrl 
     */
    constructor(id, name, dateAdded = null, thumbnailImageUrl = null) {
        this.id = id || uuidv4()
        this.name = name
        this.dateAdded = dateAdded || new Date()
        this.thumbnailImageUrl = thumbnailImageUrl
    }
}
exports.GlobalIssuer = GlobalIssuer
