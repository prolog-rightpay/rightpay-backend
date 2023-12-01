const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"

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
