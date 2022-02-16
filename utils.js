const db = require('./db/connection.js')

function checkArticleExists(num) {
    return db.query('SELECT * FROM articles WHERE article_id = $1;',
    [num]
    )
      .then((output) => {
          if (output.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Invalid ID, no data found' });
          } else {
            return Promise.reject({ status: 204, msg: 'No data for ID' });
          }
      })
}

module.exports = {
    checkArticleExists
};








  