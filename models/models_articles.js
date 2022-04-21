const db = require('../db/connection.js')
const {checkArticleExists,checkQueryTerms} = require('../utils.js')

function fetchArticles(search, limit=10, page=1) {
    const {sort_by,topic,order} = checkQueryTerms(search);
    return Promise.all([
        db.query(`SELECT 
                articles.article_id, 
                articles.author, 
                articles.created_at, 
                title, 
                topic, 
                articles.votes, 
                    COUNT(comments.article_id) AS comment_count
                    FROM articles
                    LEFT JOIN comments ON articles.article_id = comments.article_id
                    ${topic}
                    GROUP BY
                    articles.article_id
                    ORDER BY ${sort_by} ${order}
                    LIMIT ${limit} OFFSET ${limit*(page-1)};`),
        db.query(`SELECT * FROM articles
        ${topic}
        ORDER BY ${sort_by} ${order};`)
    ])
    .then(([articles, articlesFull]) => {
        return [articles.rows , articlesFull.rows.length];
    })
    .catch(()=>{
        return Promise.reject({ status: 400, msg: 'Bad Request' });
      })
}

function fetchAllArticles(search) {
    const {sort_by,topic,order} = checkQueryTerms(search);
    return Promise.all([
        db.query(`SELECT 
                articles.article_id, 
                articles.author, 
                articles.created_at, 
                title, 
                topic, 
                articles.votes, 
                    COUNT(comments.article_id) AS comment_count
                    FROM articles
                    LEFT JOIN comments ON articles.article_id = comments.article_id
                    ${topic}
                    GROUP BY
                    articles.article_id
                    ORDER BY ${sort_by} ${order};`),
        db.query(`SELECT * FROM articles
        ${topic}
        ORDER BY ${sort_by} ${order};`)
    ])
    .then(([articles, articlesFull]) => {
        return [articles.rows , articlesFull.rows.length];
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
                    WHERE article_id = ${num};`)
    .then((data) => {
        if (!data.rows[0]) return checkArticleExists(num);
        let newVotes = data.rows[0].votes + votes
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

function removeArticle(num) {
    return db.query(`DELETE FROM comments 
                    WHERE article_id = ${num};`)
        .then(()=>{
            return db.query(`DELETE FROM articles
                            WHERE article_id = ${num}
                            RETURNING * ;`)
        })
        .then(({ rows }) => {
            if (!rows[0]) return Promise.reject({ status: 404, msg: 'No article to delete' });
            return rows
        })
}

module.exports = {
    fetchArticles,
    addArticle,
    fetchArticle,
    alterArticle,
    removeArticle,
    fetchAllArticles
};