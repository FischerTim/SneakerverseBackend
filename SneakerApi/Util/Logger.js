let logger = ""
const systemModes = require('../resource/constant').mods

function get() {
    if (logger) {
        return logger
    } else {
        logger = new MyLogger(process.env.MODE)
        return logger
    }
}

class MyLogger {
    constructor(MODE) {
        this.MODE = (MODE ? MODE: systemModes.default )
    }

    dev(msg) {
        if (this.MODE == systemModes.dev) {
            console.log(msg)
        }
    }
    debug(msg) {
        if (this.MODE == systemModes.debug) {
            console.debug(msg)
        }
    }

    info(msg) {
        console.info(msg)
    }
}

module.exports = get