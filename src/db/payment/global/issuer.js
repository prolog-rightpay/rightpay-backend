const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")

const { GlobalIssuer } = require("../../../models/GlobalIssuer")

async function newGlobalIssuer(db, issuer) {
    const issuersColl = db.collection("issuers")
}
