const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")

const { GlobalIssuer } = require("../../../models/GlobalIssuer")

async function newGlobalIssuer(db, issuer) {
    const issuersColl = db.collection("issuers")
}

// const { Account } = require("../models/Account")
// const { Session } = require("../models/Session")

// const bcryptSaltRounds = 10

// async function newAccount(db, account) {
//     const accountsColl = db.collection("accounts")

//     const existing = await accountsColl.findOne({ email: account.email })
//     if (existing != null) {
//         return {
//             success: false,
//             error: "email_exists"
//         }
//     }

//     const userId = uuidv4()
//     const dateCreated = new Date()
//     const hashedPassword = await bcrypt.hash(account.password, bcryptSaltRounds)
//     await accountsColl.insertOne({
//         id: userId,
//         email: account.email,
//         password: hashedPassword,
//         first_name: account.firstName,
//         last_name: account.lastName,
//         date_created: dateCreated
//     })
//     return {
//         success: true
//     }
// }
// exports.newAccount = newAccount


