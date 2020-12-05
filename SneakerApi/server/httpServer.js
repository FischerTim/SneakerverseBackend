const http = require("http");

function get(app) {
    return http.createServer(app);
}

module.exports = get
