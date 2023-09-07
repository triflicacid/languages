const { SQLiteDatabase } = require('../SQLiteDatabase.js');

var db = new SQLiteDatabase('data/la/data.db');

/** Get all words from Vocab */
async function getWords() {
    return await db.all("SELECT * FROM `Vocab`");
}

/** Get word by latin */
async function getWordByLatin(word) {
    return await db.get("SELECT * FROM `Vocab` WHERE word = ?", [word.toLowerCase()]);
}


/** Get raw word info (as in database) */
async function getWordRaw(ID) {
    return await db.get("SELECT * FROM `Vocab` WHERE ID = ?", [ID]);
}

async function searchWords(query) {
    const queries = [], params = [];

    if (query.using === "word") {
        queries.push("word LIKE ? || '%'");
    } else {
        queries.push("translation LIKE '%' || ? || '%'");
    }
    params.push(query.query);

    if (query.type && query.type !== 'any') {
        if (query.type[query.type.length - 1] === '%') {
            queries.push("type LIKE ? || '%'");
            params.push(query.type.substring(0, query.type.length - 1));
        } else {
            queries.push("type = ?");
            params.push(queries.type);
        }

    }

    let queryString = queries.join(" AND ");
    switch (query.order) {
        case 'type':
            queryString += "ORDER BY type";
            break;
        case "alpha_latin":
            queryString += "ORDER BY word";
            break;
        case "alpha_eng":
            queryString += "ORDER BY translation";
    }

    return await db.all("SELECT * FROM `Vocab` WHERE " + queryString, params);
}

module.exports = { db, getWords, getWordRaw, searchWords };