const db = require('./database.js');

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

    // Create a new Vocab word
    socket.on("create-word", async data => {
        if (data.It.trim().length === 0 || data.En.length === 0 || data.En[0].trim().length === 0) {
            socket.emit("alert", "Missing required information.");
        } else {
            const id = await db.insertIntoVocab(data.It, data.En, data.ItPlural, data.Gender, data.Class, data.Cat, data.Comment);
            if (data.IrregVerb !== undefined) {
                await db.createIrregularVerb(id, data.IrregVerb);
            }
            socket.emit("create-word", id);
        }
    });

    // Update a Vocab record (data must provide at least the ID)
    socket.on("update-word", async data => {
        await db.updateWord(data);
    });

    // Get raw record from Vocab table
    socket.on("get-word-raw", async ID => {
        const word = await db.getWordRaw(ID);
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
            const verb = word.Class.includes("IrregVerb") ?
                await db.getIrregularVerbInfo(id) :
                (await db.db.all("PRAGMA table_info(IrregularVerbs)")).map(o => o.name).reduce((o, name) => {
                    o[name] = undefined;
                    return o;
                }, {});
            word.Verb = verb;

            if (!verb.AuxVerb) verb.AuxVerb = "avere";
            const auxVerb = await db.db.get("SELECT * FROM (SELECT * FROM Vocab WHERE It = ?) AS tmp1 JOIN IrregularVerbs ON tmp1.ID = IrregularVerbs.VocabID", [verb.AuxVerb]);
            word.AuxVerb = auxVerb;
        }

        socket.emit("get-word-info", word);
    });
}

module.exports = { setupSocket };