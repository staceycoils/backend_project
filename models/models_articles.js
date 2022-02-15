const db = require('../db/connection.js')

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
            if (!data.rows[0]) return Promise.reject();
            return data.rows[0];
        })
}

module.exports = {
    fetchArticles,
    fetchArticle
};