const { SQLiteDatabase } = require('./SQLiteDatabase.js');

var db = new SQLiteDatabase('data/data.db');

/** Return all word classes */
async function getWordClasses() {
    return await db.all("SELECT * FROM `Classes`");
}
/** Return all word categories */
async function getWordCategories() {
    return await db.all("SELECT * FROM `Categories`");
}

/** Create new vocab entry: It: string, En: string[], Class: number[], Cat: number[], Comment: string. Returns ID, */
async function insertIntoVocab(It, En, Gender, Class = [], Cat = [], Comment = "") {
    return await db.run("INSERT INTO Vocab (It, En, Gender, Class, Cat, Comment) VALUES (?, ?, ?, ?, ?, ?)", [It, En.join(","), Gender || "", Class.join(","), Cat.join(","), Comment]);
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

/** Update Vocab record by providing its object record. If property is undefined, do not update it */
async function updateWord(record) {
    const queries = [], params = [];
    if (record.It != undefined) {
        queries.push("It = ?");
        params.push(record.It);
    }
    if (record.En != undefined) {
        queries.push("En = ?");
        params.push(record.En);
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
async function createIrregularVerb(ID, data) {
    await db.run("INSERT INTO IrregularVerbs (VocabID) VALUES (?)", [ID]);
    data.VocabID = ID;
    await updateIrregularVerb(data);
}

/** Update the record of an IrregularVerb (data must contain at least `VocabID`) */
async function updateIrregularVerb(data) {
    const sql = [], params = [], names = ["Present", "ContractedInfin", "PresentParticiple", "PastParticiple", "AuxVerb", "Imperfect", "AbsPast", "Imperative", "Gerund"];
    for (const name of names) {
        if (data[name] !== undefined) {
            sql.push(`${name} = ?`);
            params.push(data[name]);
        }
    }
    if (sql.length > 0) {
        const query = sql.join(", ");
        params.push(data.VocabID);
        await db.run(`UPDATE IrregularVerbs SET ${query} WHERE VocabID = ?`, params);
    }
}

module.exports = {
    db,
    getWordClasses, updateWordClass, deleteWordClass, createWordClass,
    getWordCategories, updateWordCategory, deleteWordCategory, createWordCategory,
    getWords, insertIntoVocab, getWordRaw, updateWord,
    getIrregularVerbInfo, createIrregularVerb, updateIrregularVerb,
};