const { SQLiteDatabase } = require('../SQLiteDatabase.js');

var db = new SQLiteDatabase('data/it/data.db');

/** Return all word classes */
async function getWordClasses() {
    return await db.all("SELECT * FROM `Classes`");
}
/** Return all word categories */
async function getWordCategories() {
    return await db.all("SELECT * FROM `Categories`");
}

/** Create new vocab entry: It: string, En: string[], Class: number[], Cat: number[], Comment: string. Returns ID, */
async function insertIntoVocab(It, En, ItPlural, Gender, Class = [], Cat = [], Comment = "") {
    return await db.run("INSERT INTO Vocab (It, En, ItPlural, Gender, Class, Cat, Comment) VALUES (?, ?, ?, ?, ?, ?, ?)", [It.toLowerCase(), En.map(x => x.toLowerCase()).join(","), ItPlural.toLowerCase(), Gender || "", Class.join(","), Cat.join(","), Comment]);
}

/** Update a Word Class record. If provided values are undefined, do not update that field. */
async function updateWordClass(ID, Name, Desc) {
    let queries = [], params = [];
    if (Name !== undefined) {
        queries.push("Name = ?");
        params.push(Name);
    }
    if (Desc !== undefined) {
        queries.push("Desc = ?");
        params.push(Desc);
    }
    if (queries.length !== 0) {
        let query = queries.join(" AND ");
        return await db.run(`UPDATE \`Classes\` SET ${query} WHERE ID = ${ID}`, params);
    }
}

/** Create a new word class. */
async function createWordClass(Name, Desc = '') {
    return await db.run("INSERT INTO `Classes` (Name, Desc) VALUES (?, ?)", [Name, Desc || '']);
}

/** Delete a word class entry with a given ID */
async function deleteWordClass(ID) {
    await db.run("DELETE FROM `Classes` WHERE ID = ?", [ID]);
}

/** Update a Word Category record. If provided values are undefined, do not update that field. */
async function updateWordCategory(ID, Name, Desc) {
    let queries = [], params = [];
    if (Name !== undefined) {
        queries.push("Name = ?");
        params.push(Name);
    }
    if (Desc !== undefined) {
        queries.push("Desc = ?");
        params.push(Desc);
    }
    if (queries.length !== 0) {
        let query = queries.join(" AND ");
        return await db.run(`UPDATE \`Categories\` SET ${query} WHERE ID = ${ID}`, params);
    }
}

/** Create a new word category. */
async function createWordCategory(Name, Desc = '') {
    return await db.run("INSERT INTO `Categories` (Name, Desc) VALUES (?, ?)", [Name, Desc || '']);
}

/** Delete a word category entry with a given ID */
async function deleteWordCategory(ID) {
    await db.run("DELETE FROM `Categories` WHERE ID = ?", [ID]);
}

/** Get all words from Vocab */
async function getWords() {
    return await db.all("SELECT * FROM `Vocab`");
}

/** Get raw word info (as in database) */
async function getWordRaw(ID) {
    return await db.get("SELECT * FROM `Vocab` WHERE ID = ?", [ID]);
}

/** Get word by italian */
async function getWordByItalian(italian) {
    return await db.get("SELECT * FROM `Vocab` WHERE It = ?", [italian.toLowerCase()]);
}

/** Update Vocab record by providing its object record. If property is undefined, do not update it */
async function updateWord(record) {
    const queries = [], params = [];
    if (record.It != undefined) {
        queries.push("It = ?");
        params.push(record.It.toLowerCase());
    }
    if (record.En != undefined) {
        queries.push("En = ?");
        params.push(record.En.toLowerCase());
    }
    if (record.ItPlural != undefined) {
        queries.push("ItPlural = ?");
        params.push(record.ItPlural.toLowerCase());
    }
    if (record.Gender != undefined) {
        queries.push("Gender = ?");
        params.push(record.Gender);
    }
    if (record.Class != undefined) {
        queries.push("Class = ?");
        params.push(record.Class);
    }
    if (record.Cat != undefined) {
        queries.push("Cat = ?");
        params.push(record.Cat);
    }
    if (record.Image != undefined) {
        queries.push("Image = ?");
        params.push(record.Image);
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

/** Get record from IrregularVerbs */
async function getIrregularVerbInfo(ID) {
    return await db.get("SELECT * FROM IrregularVerbs WHERE VocabID = ?", [ID]);
}

/** Create an entry for an IrregularVerb with the given ID and provided data */
async function createIrregularVerb(ID, data = {}) {
    await db.run("INSERT INTO IrregularVerbs (VocabID) VALUES (?)", [ID]);
    data.VocabID = ID;
    await updateIrregularVerb(data);
}

/** Delete an entry for an IrregularVerb given the VocabID */
async function deleteIrregularVerb(ID) {
    await db.run("DELETE FROM IrregularVerbs WHERE VocabID = ?", [ID]);
}

/** Update the record of an IrregularVerb (data must contain at least `VocabID`) */
async function updateIrregularVerb(data) {
    const sql = [], params = [], names = ["Present", "ContractedInfin", "PresentParticiple", "PastParticiple", "AuxVerb", "Imperfect", "AbsPast", "Imperative", "Gerund"];
    for (const name of names) {
        if (data[name] !== undefined) {
            sql.push(`${name} = ?`);
            params.push(data[name].toString().toLowerCase());
        }
    }
    if (sql.length > 0) {
        const query = sql.join(", ");
        params.push(data.VocabID);
        await db.run(`UPDATE IrregularVerbs SET ${query} WHERE VocabID = ?`, params);
    }
}

/** Get all phrases from Phrases */
async function getPhrases() {
    return await db.all("SELECT * FROM `Phrases`");
}

/** Get raw phrase info (as in database) */
async function getPhraseRaw(ID) {
    return await db.get("SELECT * FROM `Phrases` WHERE ID = ?", [ID]);
}

/** Get phrase by italian */
async function getPhraseByItalian(italian) {
    return await db.get("SELECT * FROM `Phrases` WHERE It = ?", [italian.toLowerCase()]);
}

/** Create new phrase entry: It: string, En: string[], Cat: number[], Comment: string. Returns ID, */
async function insertIntoPhrases(It, En, Cat = [], Comment = "") {
    return await db.run("INSERT INTO Phrases (It, En, Cat, Comment) VALUES (?, ?, ?, ?)", [It.toLowerCase(), En.map(x => x.toLowerCase()).join(","), Cat.join(","), Comment]);
}

/** Update Phrase record by providing its object record. If property is undefined, do not update it */
async function updatePhrase(record) {
    const queries = [], params = [];
    if (record.It != undefined) {
        queries.push("It = ?");
        params.push(record.It.toLowerCase());
    }
    if (record.En != undefined) {
        queries.push("En = ?");
        params.push(record.En.toLowerCase());
    }
    if (record.Cat != undefined) {
        queries.push("Cat = ?");
        params.push(record.Cat);
    }
    if (record.Comment != undefined) {
        queries.push("Comment = ?");
        params.push(record.Comment);
    }
    if (queries.length !== 0) {
        params.push(record.ID);
        await db.run("UPDATE `Phrases` SET " + queries.join(", ") + " WHERE ID = ?", params);
    }
}

module.exports = {
    db,
    getWordClasses, updateWordClass, deleteWordClass, createWordClass,
    getWordCategories, updateWordCategory, deleteWordCategory, createWordCategory,
    getWords, getWordByItalian, insertIntoVocab, getWordRaw, updateWord,
    getIrregularVerbInfo, createIrregularVerb, updateIrregularVerb, deleteIrregularVerb,
    getPhrases, getPhraseRaw, getPhraseByItalian, insertIntoPhrases, updatePhrase,
};