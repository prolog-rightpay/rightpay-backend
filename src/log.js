function print(msg, level) {
    const date = new Date()
    console.log(`${date.toISOString()} [${level}] ${msg}`)
}

function info(msg) {
    print(msg, "info")
}
exports.info = info

function error(msg) {
    print(msg, "error")
}
exports.error = error

 
function warning(msg) {
    print(msg, "warning")
}
exports.warning = warning
