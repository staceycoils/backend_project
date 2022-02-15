const db = require('../db/connection.js')

function fetchTopics() {
    return db.query("SELECT * FROM topics")
        .then((data) => {
            return data.rows
        })
}

function fetchArticles() {
    return db.query("SELECT * FROM articles")
        .then((data) => {
            return data.rows
        })
}

function fetchArticle(num) {
    return db.query("SELECT * FROM articles")
        .then((data) => {
            if (!data.rows[num]) return Promise.reject();
            return data.rows[num];
        })
}

function alterArticle(num, votes) {
    return db.query(`SELECT * FROM articles
                    ORDER BY article_id ASC;`)
    .then((data) => {
        if (!data.rows[num]) return Promise.reject();
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
    fetchTopics,
    fetchArticles,
    fetchArticle,
    alterArticle
};