const { SQLiteDatabase } = require('../SQLiteDatabase.js');

var db = new SQLiteDatabase('data/sv/data.db');

/** Get all words from Vocab */
async function getWords() {
    return await db.all("SELECT * FROM `Vocab`");
}

/** Get word */
async function getWordBySwedish(word) {
    return await db.get("SELECT * FROM `Vocab` WHERE Word = ?", [word.toLowerCase()]);
}


/** Get raw word info (as in database) */
async function getWordRaw(ID) {
    return await db.get("SELECT * FROM `Vocab` WHERE ID = ?", [ID]);
}

async function searchWords(query) {
    const queries = [], params = [];

    if (query.using === "word") {
        queries.push("Word LIKE ? || '%'");
    } else {
        queries.push("En LIKE '%' || ? || '%'");
    }
    params.push(query.query);

    if (query.type && query.type !== 'any') {
        if (query.type[query.type.length - 1] === '%') {
            queries.push("Class LIKE ? || '%'");
            params.push(query.type.substring(0, query.type.length - 1));
        } else {
            queries.push("Class = ?");
            params.push(queries.type);
        }

    }

    let queryString = queries.join(" AND ");
    switch (query.order) {
        case 'class':
            queryString += "ORDER BY Class";
            break;
        case "word":
            queryString += "ORDER BY Word";
            break;
        case "en":
            queryString += "ORDER BY En";
    }

    return await db.all("SELECT * FROM `Vocab` WHERE " + queryString, params);
}

/** Update Vocab record by providing its object record. If property is undefined, do not update it */
async function updateWord(record) {
    const queries = [], params = [];
    if (record.Word != undefined) {
        queries.push("Word = ?");
        params.push(record.Word.toLowerCase());
    }
    if (record.En != undefined) {
        queries.push("En = ?");
        params.push(record.En.toLowerCase());
    }
    if (record.Plural != undefined) {
        queries.push("Plural = ?");
        params.push(record.Plural.toLowerCase());
    }
    if (record.Gender != undefined) {
        queries.push("Gender = ?");
        params.push(record.Gender);
    }
    if (record.Class != undefined) {
        queries.push("Class = ?");
        params.push(record.Class);
    }
    if (record.Tags != undefined) {
        queries.push("Tags = ?");
        params.push(record.Tags);
    }
    if (record.Comment != undefined) {
        queries.push("Comment = ?");
        params.push(record.Comment);
    }
    if (queries.length !== 0) {
        params.push(record.ID);
        await db.run("UPDATE `Vocab` SET " + queries.join(", ") + " WHERE ID = ?", params);
    }
}

/** Create new vocab entry: Sv: string, En: string[], Class: string[], Cat: string[], Comment: string. Returns ID, */
async function insertIntoVocab(Word, En, ItPlural, Gender, Class = "", Tags = "", Comment = "") {
    return await db.run("INSERT INTO Vocab (Word, En, Plural, Gender, Class, Tags, Comment) VALUES (?, ?, ?, ?, ?, ?, ?)", [Word.toLowerCase(), En.map(x => x.toLowerCase()).join(","), ItPlural.toLowerCase(), Gender || "", Class, Tags, Comment]);
}

module.exports = { db, getWords, getWordBySwedish, getWordRaw, searchWords, updateWord, insertIntoVocab };