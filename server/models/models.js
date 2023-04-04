const { Pool } = require('pg');
const PG_URI = 'postgres://zfiepste:gFLyXROu27tkXIl8d5KdfucPU9yETXTb@mahmud.db.elephantsql.com/zfiepste';

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};