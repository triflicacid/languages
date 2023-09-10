module.exports = {
    databases: {
        it: require("./it/database.js").db,
        la: require("./la/database.js").db,
        sv: require("./sv/database.js").db,
    }
};
