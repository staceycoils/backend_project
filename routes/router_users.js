const usersRouter = require('express').Router();
const { 
    getUsers,
    getUser,
    getUserArticles,
    getUserComments
} = require('../controllers/controllers_users.js');

usersRouter.get("/", getUsers)
usersRouter.get("/:username", getUser)
usersRouter.get("/:username/articles", getUserArticles)
usersRouter.get("/:username/comments", getUserComments)

module.exports = usersRouter;