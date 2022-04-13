const db = require('../db/connection.js');
const { checkArticleExists, checkCommentExists } = require('../utils')

function alterComment(num, votes) {
    if (typeof votes !== 'number') return Promise.reject({ status: 400, msg: 'Bad Request' })
    return db.query(`SELECT * FROM comments
                    ORDER BY comment_id ASC;`)
    .then((data) => {
        if (!data.rows[num-1]) return checkCommentExists(num);
        let newVotes = data.rows[num-1].votes + votes
        return db.query(
            `UPDATE comments 
            SET votes = ${[newVotes]}
            WHERE comment_id = ${[num]}
            RETURNING *;`
          )
          .then((data) => {
            return data.rows[0]
        })
    })
}

function removeComment(num) {
    return db.query(`DELETE FROM comments 
                    WHERE comment_id = ${num}
                    RETURNING * ;`)
        .then(({ rows }) => {
            if (rows.length === 0) return Promise.reject({ status: 404, msg: 'No comment to delete' });
            return rows
        })
}

function fetchArtComments(num, limit=10, page=1) {
    return db.query(`SELECT comment_id, votes, created_at, author, body FROM comments
                    WHERE article_id = ${[num]}
                    LIMIT ${limit} OFFSET ${limit*(page-1)};`)
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
                    VALUES ('${comment.username}', '${comment.body}', ${num}) 
                    RETURNING * ;`)
                    .then(({ rows }) => {
                        if (!rows[0]) return checkArticleExists(num)
                        return rows[0]
                    })
            })
};

module.exports = {
    alterComment,
    removeComment,
    fetchArtComments,
    addArtComments
}; 