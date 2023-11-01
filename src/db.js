const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
console.log(uri)

async function connect() {
    const client = new MongoClient(uri)
    client.connect()

    const accountsDatabase = client.db("rightpay_accounts")
    const paymentMethodsDatabase = client.db("rightpay_payment_methods")
    const appDatabase = client.db("rightpay_app")

    return {
        databases: {
            accounts: accountsDatabase,
            paymentMethods: paymentMethodsDatabase,
            app: appDatabase
        }
    }
}
exports.connect = connect
