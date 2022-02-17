const db = require('../db/connection.js')
const {checkArticleExists} = require('../utils.js')

function fetchArticles() {
    return db.query("SELECT * FROM articles;")
        .then((data) => {
            return data.rows
        })
}

function fetchArticle(num) {
    return db.query(`SELECT * FROM articles
                    WHERE article_id = ${num};`)
        .then((data) => {
            if (!data.rows[0]) return checkArticleExists(num)
            return data.rows[0];
        })
}

function alterArticle(num, votes) {
    return db.query(`SELECT * FROM articles
                    ORDER BY article_id ASC;`)
    .then((data) => {
        if (!data.rows[num]) return Promise.reject({ status: 404, msg: 'Invalid ID, no data found' });
        let newVotes = data.rows[num-1].votes + votes
        return db.query(
            `UPDATE articles 
            SET votes = ${[newVotes]}
            WHERE article_id = ${[num]}
            RETURNING *;`
          )
          .then((data) => {
            return data.rows[0]
        })
    })
}

module.exports = {
    fetchArticles,
    fetchArticle,
    alterArticle
};