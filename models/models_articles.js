const db = require('../db/connection.js')
const {checkArticleExists,checkQueryTerms} = require('../utils.js')

function fetchArticles(search) {
    let {sort_by,topic,order} = checkQueryTerms(search)
    return db.query(`SELECT article_id, author, created_at, title, topic, votes FROM articles
                    ${topic}
                    ORDER BY ${sort_by} ${order};`)
        .then((articles) => {
            articles.rows.map((article) => article.comment_count = 0)
            return db.query(`SELECT * FROM comments;`)
                .then((comments) => {
                    comments.rows.forEach(comment => {
                            if (!articles.rows[comment.article_id - 1]) return
                            articles.rows[comment.article_id - 1].comment_count += 1
                    });
                    return articles.rows
                })
        })
        .catch(()=>{
          return Promise.reject({ status: 400, msg: 'Bad Request' });
        })
}

function addArticle(article) {
    const { title, author, body, topic } = article
        return db.query(
            `INSERT INTO articles (title, author, body, topic)
            VALUES ('${title}', '${author}', '${body}', '${topic}') 
            RETURNING * ;`)
            .then(({ rows }) => {
                rows[0].comment_count=0
                return rows[0]
            })
};

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

function fetchArtComments(num) {
    return db.query(`SELECT comment_id, votes, created_at, author, body FROM comments
                    WHERE article_id = ${[num]};`)
        .then(({ rows }) => {
            if (!rows[0]) return checkArticleExists(num)
            return rows
        })
}

function addArtComments(num, comment) {
    return db.query(`SELECT * FROM articles
                    ORDER BY article_id ASC;`)
            .then((data) => {
                if (!data.rows[num-1]) return checkArticleExists(num);
                return db.query(
                    `INSERT INTO comments (author, body, article_id)
                    VALUES ('${comment.username}', '${comment.body}', 2) 
                    RETURNING * ;`)
                    .then(({ rows }) => {
                        if (!rows[0]) return checkArticleExists(num)
                        return rows[0]
                    })
            })
};

module.exports = {
    fetchArticles,
    addArticle,
    fetchArticle,
    alterArticle,
    fetchArtComments,
    addArtComments
};