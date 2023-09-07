const { db: it } = require("./it/database.js");
const { db: la } = require("./la/database.js");

module.exports = {
    databases: {
        it,
        la
    }
};
