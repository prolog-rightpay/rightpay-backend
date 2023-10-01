const { MongoClient } = require("mongodb")

const uri = "mongodb://127.0.0.1:27017"

async function connect() {
    const client = new MongoClient(uri)
    client.connect()

    const accountsDatabase = client.db("accounts")
    const paymentMethodsDatabase = client.db("payment_methods")
    const appDatabase = client.db("app")

    return {
        databases: {
            accounts: accountsDatabase,
            paymentMethods: paymentMethodsDatabase,
            app: appDatabase
        }
    }
}
exports.connect = connect
