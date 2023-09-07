const { setupSocket: it } = require("./it/socket.js");
const { setupSocket: la } = require("./la/socket.js");

function setupSocket(code, socket) {
    switch (code) {
        case "it":
            return it(socket);
        case "la":
            return la(socket);
        default:
            console.error(" [!] Cannot setup socket: unknown code " + code);
            return;
    }
}

module.exports = { setupSocket };
