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

module.exports = {
    fetchArticles,
    fetchArticle
};