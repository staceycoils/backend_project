const {
    fetchUsers,
    fetchUser
} = require('../models/models_users.js')

function getUsers(req,res,next) {
    fetchUsers()
    .then((data) => {
        res.status(200).send({ 'usernames': data })
    })
    .catch(next)
}

function getUser(req,res,next) {
    const user = req.params.username
    fetchUser(user)
    .then((data) => {
        res.status(200).send({ 'user': data })
    })
    .catch(next)
}

module.exports = {
    getUsers,
    getUser
} 