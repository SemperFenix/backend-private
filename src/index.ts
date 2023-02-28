import http from 'http';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';
import createDebug from 'debug';

const debug = createDebug('W6B');

const PORT = process.env.PORT || 4251;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB:', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('Server error: ', error.message);
});

server.on('listening', () => {
  debug(
    'Server listening in http://localhost: ' +
      PORT +
      '\n Have a nice experience'
  );
});
