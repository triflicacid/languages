const express = require('express');
const { Server } = require('socket.io');
const { terminate } = require('./utils.js');
const { db } = require('./database.js');
const { setupSocket } = require('./socket.js');

(async function main() {
  const PORT = process.argv.length > 2 ? +process.argv[2] : 3000;

  await db.open();
  console.log(`[database]: Opened connection: ${db.path}`);

  const app = express();

  app.use(express.urlencoded({ extended: true })); // Read form data
  app.use(express.static('./public/')); // Static files

  const server = app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  const io = new Server(server);

  io.on("connection", socket => {
    console.log(`[NEW SOCKET CONNECTION] ${socket.id}`);
    setupSocket(socket);
  });

  // Handle exits - ensure graceful shutdown
  const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500,
    log: true,
    fn: async () => {
      await db.close(); // Close database handle
      console.log(`[database]: Closed connection: ${db.path}`);
    }
  });

  // Exit handler triggers
  process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
  process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
  process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
  process.on('SIGINT', exitHandler(0, 'SIGINT'));
})();