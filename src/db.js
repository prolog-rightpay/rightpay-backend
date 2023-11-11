const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
console.log(uri)

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

async function connect() {
    const client = new MongoClient(uri)
    await client.connect()

    const accountsDatabase = client.db("rightpay_accounts")
    const globalWalletDatabase = client.db("rightpay_global_wallet")
    const userWalletDatabase = client.db("rightpay_user_wallet")
    const appDatabase = client.db("rightpay_app")

    return {
        databases: {
            accounts: accountsDatabase,
            globalWallet: globalWalletDatabase,
            userWallet: userWalletDatabase,
            app: appDatabase,
        }
    }
}
exports.connect = connect
