const db = require('./database.js');

/** Set=up socket event listeners */
function setupSocket(socket) {
    // Simple text message
    socket.on("message", text => {
        console.log(`[SOCKET MESSAGE] ${socket.id}: ${text}`);
    });

    // Get raw record from Vocab table
    socket.on("get-word-raw", async ({ query, verb }) => {
        let word;
        if (!isNaN(+query)) { // Valid ID?
            word = await db.getWordRaw(+query);
        } else {
            word = await db.getWordByLatin(query.trim());
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
}

module.exports = { setupSocket };