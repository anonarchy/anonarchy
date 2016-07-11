var pg = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'alexlerman',
    password : '',
    database : 'anonypost'
  }
});
module.exports = require('bookshelf')(pg);
