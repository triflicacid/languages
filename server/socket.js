const { setupSocket: it } = require("./it/socket.js");
const { setupSocket: la } = require("./la/socket.js");
const { setupSocket: sv } = require("./sv/socket.js");

function setupSocket(code, socket) {
    switch (code) {
        case "it":
            return it(socket);
        case "la":
            return la(socket);
        case "sv":
            return sv(socket);
        default:
            console.error(" [!] Cannot setup socket: unknown code " + code);
            return;
    }
}

module.exports = { setupSocket };
