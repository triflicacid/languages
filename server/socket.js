const db = require('./it/database.js');

/** Set=up socket event listeners */
function setupSocket(socket) {
    // Simple text message
    socket.on("message", text => {
        console.log(`[SOCKET MESSAGE] ${socket.id}: ${text}`);
    });

    // Request array of word classes
    socket.on("get-word-classes", async () => {
        const ar = await db.getWordClasses();
        socket.emit("get-word-classes", ar);
    });

    // Update word class with given ID
    socket.on("update-word-class", async ({ ID, Name, Desc }) => {
        await db.updateWordClass(ID, Name, Desc);
        socket.emit("message", `Updated word class ID=${ID}`);
    });

    // Delete word class with given ID
    socket.on("delete-word-class", async ID => {
        await db.deleteWordClass(ID);
    });

    // Create a new word class
    socket.on("create-word-class", async ({ Name, Desc }) => {
        const ID = await db.createWordClass(Name, Desc);
        socket.emit("create-word-class", { ID, Name, Desc });
    });

    // Request array of word categories
    socket.on("get-word-categories", async () => {
        const ar = await db.getWordCategories();
        socket.emit("get-word-categories", ar);
    });

    // Update word category with given ID
    socket.on("update-word-cat", async ({ ID, Name, Desc }) => {
        await db.updateWordCategory(ID, Name, Desc);
        socket.emit("message", `Updated word category ID=${ID}`);
    });

    // Delete word category with given ID
    socket.on("delete-word-cat", async ID => {
        await db.deleteWordCategory(ID);
    });

    // Create a new word category
    socket.on("create-word-cat", async ({ Name, Desc }) => {
        const ID = await db.createWordCategory(Name, Desc);
        socket.emit("create-word-cat", { ID, Name, Desc });
    });

    // Delete IrregVerb information
    socket.on("delete-irreg-verb-info", async ID => {
        await db.deleteIrregularVerb(ID);
    });

    // Create IrregVerb information
    socket.on("create-irreg-verb-info", async ({ ID, data }) => {
        await db.createIrregularVerb(ID, data);
    });

    // Italian: check if word entry exists
    socket.on("word-exists", async (it) => {
        const exist = await db.getWordByItalian(it);
        if (exist) {
            socket.emit("word-exists", it);
        }
    });

    // Italian: check if phrase entry exists
    socket.on("phrase-exists", async (it) => {
        const exist = await db.getPhraseByItalian(it);
        if (exist) {
            socket.emit("phrase-exists", it);
        }
    });

    // Create a new Vocab word
    socket.on("create-word", async data => {
        if (data.It.trim().length === 0 || data.En.length === 0 || data.En[0].trim().length === 0) {
            socket.emit("alert", "Missing required information.");
        } else {
            const exist = await db.getWordByItalian(data.It);
            if (exist) {
                socket.emit("alert", `An entry for "${data.It}" already exists.`);
            } else {
                const id = await db.insertIntoVocab(data.It, data.En, data.ItPlural, data.Gender, data.Class, data.Cat, data.Comment);
                if (data.IrregVerb !== undefined) {
                    await db.createIrregularVerb(id, data.IrregVerb);
                }
                socket.emit("create-word", id);
            }
        }
    });

    // Update a Vocab record (data must provide at least the ID)
    socket.on("update-word", async data => {
        await db.updateWord(data);
        if (data.Verb) { // Update Verb details?
            await db.updateIrregularVerb({ VocabID: data.ID, ...data.Verb });
        }
    });

    // Get raw record from Vocab table
    socket.on("get-word-raw", async ({ query, verb }) => {
        let word;
        if (!isNaN(+query)) { // Valid ID?
            word = await db.getWordRaw(+query);
        } else {
            word = await db.getWordByItalian(query.trim());
        }
        // Populate potential verb information?
        if (word && verb) {
            const wordClasses = await db.getWordClasses();
            const classes = word.Class ? word.Class.split(',').map(k => wordClasses.find(wc => wc.ID == k).Name) : [];

            if (classes.includes("Verb")) {
                let verb = classes.includes("IrregVerb") ? await db.getIrregularVerbInfo(word.ID) : undefined;
                if (!verb) {
                    verb = (await db.db.all("PRAGMA table_info(IrregularVerbs)")).map(o => o.name).reduce((o, name) => {
                        o[name] = undefined;
                        return o;
                    }, {});
                }

                if (!verb.AuxVerb) verb.AuxVerb = "avere";
                word.Verb = verb;
            }
        }
        socket.emit("get-word-raw", word);
    });

    // Get array of all words (array of get-word-raw)
    socket.on("get-words", async () => {
        const words = await db.getWords();
        socket.emit("get-words", words);
    });

    // Get word along with any appropriate extras
    socket.on("get-word-info", async id => {
        id = +id;
        const word = await db.getWordRaw(id);

        // Split English translations
        word.En = word.En ? word.En.split(",").map(a => isNaN(+a) ? a : (+a).toLocaleString('en-GB')) : [];

        // Populate word class names
        const wordClasses = await db.getWordClasses();
        word.Class = word.Class ? word.Class.split(',').map(k => wordClasses.find(wc => wc.ID == k).Name) : [];

        // Populate word category names
        const wordCategories = await db.getWordCategories();
        word.Cat = word.Cat ? word.Cat.split(',').map(k => wordCategories.find(wc => wc.ID == k).Name) : [];

        if (word.Class.includes("Verb")) {
            let verb = word.Class.includes("IrregVerb") ? await db.getIrregularVerbInfo(id) : undefined;
            if (!verb) {
                verb = (await db.db.all("PRAGMA table_info(IrregularVerbs)")).map(o => o.name).reduce((o, name) => {
                    o[name] = undefined;
                    return o;
                }, {});
            }
            word.Verb = verb;

            if (!verb.AuxVerb) verb.AuxVerb = "avere";
            const auxVerb = await db.db.get("SELECT * FROM (SELECT * FROM Vocab WHERE It = ?) AS tmp1 JOIN IrregularVerbs ON tmp1.ID = IrregularVerbs.VocabID", [verb.AuxVerb]);
            word.AuxVerb = auxVerb;
        }

        socket.emit("get-word-info", word);
    });

    // Get array of all phrases
    socket.on("get-phrases", async () => {
        const phrases = await db.getPhrases();
        socket.emit("get-phrases", phrases);
    });

    // Get raw record from Phrase table
    socket.on("get-phrase-raw", async (query) => {
        let phrase;
        if (!isNaN(+query)) { // Valid ID?
            phrase = await db.getPhraseRaw(+query);
        } else {
            phrase = await db.getPhraseByItalian(query.trim());
        }
        socket.emit("get-phrase-raw", phrase);
    });

    // Get phrase along with any appropriate extras
    socket.on("get-phrase-info", async id => {
        id = +id;
        const phrase = await db.getPhraseRaw(id);

        // Split English translations
        phrase.En = phrase.En ? phrase.En.split(",").map(a => isNaN(+a) ? a : (+a).toLocaleString('en-GB')) : [];

        // Populate word category names
        const wordCategories = await db.getWordCategories();
        phrase.Cat = phrase.Cat ? phrase.Cat.split(',').map(k => wordCategories.find(wc => wc.ID == k).Name) : [];

        socket.emit("get-phrase-info", phrase);
    });

    // Create a new Phrase
    socket.on("create-phrase", async data => {
        if (data.It.trim().length === 0 || data.En.length === 0 || data.En[0].trim().length === 0) {
            socket.emit("alert", "Missing required information.");
        } else {
            const exist = await db.getPhraseByItalian(data.It);
            if (exist) {
                socket.emit("alert", `An entry for "${data.It}" already exists.`);
            } else {
                const id = await db.insertIntoPhrases(data.It, data.En, data.Cat, data.Comment);
                socket.emit("create-phrase", id);
            }
        }
    });

    // Update a Phrase record (data must provide at least the ID)
    socket.on("update-phrase", async data => {
        await db.updatePhrase(data);
    });
}

module.exports = { setupSocket };