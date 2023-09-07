module.exports = {
    databases: {
        it: require("./it/database.js").db,
        la: require("./it/database.js").db,
        sv: require("./sv/database.js").db,
    }
};
