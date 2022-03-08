const db = require('../db/connection.js');
const { checkCommentExists} = require('../utils')

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

module.exports = {
    alterComment,
    removeComment
}; 