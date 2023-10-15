/** Issuer of payment methods, e.g. Chase or American Express. Not to be confused with network such as Visa or Mastercard. */
class GlobalIssuer {
    /** @type {string} UUID of the issuer. */
    id = null
    /** @type {[number]} Array of 6-digit bin */
    bin = null
    /** @type {string} User-facing name of the issuer, e.g. `Chase` */
    name = null
    /** @type {string?} URL of a square thumbnail image. */
    thumbnailImageUrl = null

    constructor(id, bin, name, thumbnailImageUrl) {
        this.id = id
        this.bin = bin
        this.name = name
        this.thumbnailImageUrl = thumbnailImageUrl
    }
}
exports.GlobalIssuer = GlobalIssuer
