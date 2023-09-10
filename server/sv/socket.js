const db = require('./database.js');

/** Set=up socket event listeners */
function setupSocket(socket) {
    // Simple text message
    socket.on("message", text => {
        console.log(`[SOCKET MESSAGE] ${socket.id}: ${text}`);
    });

    // Get raw record from Vocab table
    socket.on("get-word-raw", async query => {
        let word;
        if (!isNaN(+query)) { // Valid ID?
            word = await db.getWordRaw(+query);
        } else {
            word = await db.getWordBySwedish(query.trim());
        }

        socket.emit("get-word-raw", word);
    });

    // Get array of all words (array of get-word-raw)
    socket.on("get-words", async () => {
        const words = await db.getWords();
        socket.emit("get-words", words);
    });

    socket.on("wordlist-search", async query => {
        const words = await db.searchWords(query);
        if (query.order === "random") words.sort(() => Math.random() - 0.5);
        socket.emit("wordlist-search", {
            query,
            result: words
        });
    });

    // Check if word entry exists
    socket.on("word-exists", async word => {
        const exist = await db.getWordBySwedish(word);
        if (exist) {
            socket.emit("word-exists", word);
        }
    });

    // Update a Vocab record (data must provide at least the ID)
    socket.on("update-word", async data => {
        await db.updateWord(data);
    });

    // Create a new Vocab word
    socket.on("create-word", async data => {
        if (data.Word.trim().length === 0 || data.En.length === 0 || data.En[0].trim().length === 0) {
            socket.emit("alert", "Missing required information.");
        } else {
            const exist = await db.getWordBySwedish(data.Word);
            if (exist) {
                socket.emit("alert", `An entry for "${data.Word}" already exists.`);
            } else {
                const id = await db.insertIntoVocab(data.Word, data.En, data.Plural, data.Gender, data.Class, data.Tags, data.Comment);
                socket.emit("create-word", id);
            }
        }
    });
}

module.exports = { setupSocket };