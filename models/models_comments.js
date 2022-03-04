const db = require('../db/connection.js')

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
    removeComment
}; 