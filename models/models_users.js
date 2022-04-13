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

module.exports = {
    fetchUsers,
    fetchUser
}; 