const db = require('../db/connection.js')
const {checkArticleExists} = require('../utils.js')

function fetchArticles() {
    return db.query(`SELECT author, title, article_id, topic, created_at, votes FROM articles
                    ORDER BY created_at DESC;`)
        .then(({ rows }) => {
            return rows
        })
}

function fetchArticle(num) {
    return db.query(`SELECT * FROM articles
                    WHERE article_id = ${num};`)
        .then((data) => {
            if (!data.rows[0]) return checkArticleExists(num)
            return db.query(`SELECT comment_id FROM comments
                            WHERE article_id = ${num};`)
                .then((commentData) => {
                    if (!commentData.rows.length) data.rows[0].comment_count = 0;
                    data.rows[0].comment_count = (commentData.rows.length);
                    return data.rows[0];
                })
        })
}

function alterArticle(num, votes) {
    if (typeof votes !== 'number') return Promise.reject({ status: 400, msg: 'Bad Request' })
    return db.query(`SELECT * FROM articles
                    ORDER BY article_id ASC;`)
    .then((data) => {
        if (!data.rows[num-1]) return checkArticleExists(num);
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