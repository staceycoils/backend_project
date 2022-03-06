const db = require('./db/connection.js')
const { readFile } = require('fs');
const fs = require('fs/promises');


function getApi(req,res,next) {
  fs.readFile('./endpoints.json')
      .then((data) => {
          return data
      })
      .then((data) => {
          res.status(200).send(data)
      })
      .catch(next)
}

function checkArticleExists(num) {
    return db.query('SELECT * FROM articles WHERE article_id = $1;',
    [num]
    )
      .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Invalid ID, no data found' });
          } else {
            return Promise.reject({ status: 204, msg: 'No data for ID' });
          }
      })
}

function checkCommentExists(num) {
  return db.query('SELECT * FROM comments WHERE comment_id = $1;',
  [num]
  )
    .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Invalid ID, no data found' });
        } else {
          return Promise.reject({ status: 204, msg: 'No data for ID' });
        }
    })
}

function checkQueryTerms(search) {
  const searchKeys = {};
  !search.sort_by ? searchKeys.sort_by = 'created_at' : searchKeys.sort_by = search.sort_by.toLowerCase();
  !search.topic ? searchKeys.topic = '' : searchKeys.topic = `WHERE topic = '${search.topic}'`;
  !search.order ? searchKeys.order = 'DESC' : searchKeys.order = search.order.toUpperCase();
  return searchKeys
}

module.exports = {
    getApi,
    checkArticleExists,
    checkCommentExists,
    checkQueryTerms
};








  