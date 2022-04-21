const db = require('../db/connection.js')

function fetchUsers() {
    return db.query("SELECT username FROM users;")
        .then((data) => {
            let users = []
            data.rows.forEach((user) => {
                users.push(user.username)
            })
            return users
        })
}

function fetchUser(username) {
    return db.query(`SELECT * FROM users
                    WHERE username = '${username}';`)
        .then(({ rows }) => {
            if (rows.length === 0) return Promise.reject({ status: 404, msg: 'No username on record' });
            return rows[0]
        })
}

function fetchUserArticles(username) {
    return Promise.all([
        db.query(`SELECT * FROM articles
                WHERE author = '${username}';`),
        db.query(`SELECT * FROM users
                WHERE username = '${username}';`)
    ])
        .then(([articles, users]) => {
            if (articles.rows.length === 0 && users.rows.length == 0) {
                return Promise.reject({ status: 404, msg: 'No username on record' });
            }
            if (articles.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'No articles for user' });
            }
            return articles.rows
        })
}

function fetchUserComments(username) {
    return Promise.all([
        db.query(`SELECT * FROM comments
                WHERE author = '${username}';`),
        db.query(`SELECT * FROM users
                WHERE username = '${username}';`)
    ])
        .then(([comments, users]) => {
            console.log(comments.rows)
            if (comments.rows.length === 0 && users.rows.length == 0) {
                return Promise.reject({ status: 404, msg: 'No username on record' });
            }
            if (comments.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'No comments for user' });
            }
            return comments.rows
        })
}

module.exports = {
    fetchUsers,
    fetchUser,
    fetchUserArticles,
    fetchUserComments
}; 