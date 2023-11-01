require("dotenv").config()

const fs = require("fs")
const path = require("path")

const express = require("express")
const app = express()

const log = require("./src/log")

const db = require("./src/db")
db.connect()
.then(con => {
    log.info("connected to mongodb")
    app.set("db", con.databases)
})
.catch(err => {
    console.log(err)
    log.error("failed to connect to mongodb, closing server")
    process.exit(1)
})

// setup the logger, morgan is the express logger
const morgan = require("morgan")
const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" })
app.use(morgan("combined", { stream: accessLogStream }))

app.use("/api", require("./routes/api"))

const port = process.env.PORT || 3000
app.listen(port, () => {
    log.info(`web app listening on port ${port}`)
})
