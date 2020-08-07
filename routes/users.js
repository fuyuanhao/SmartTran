let express = require('express');
let usersRouter = express.Router();
let db = require('./pgHelper.js');

// 这里的根目录实际上是/users
usersRouter.get('/', db.toUserinfoManagement);

usersRouter.get('/add', db.addUserinfoGET);

usersRouter.post('/add', db.addUserinfoPOST);

usersRouter.get('/delete/:id', db.deleteUserinfo);

usersRouter.get('/update/:id',db.updateUserinfoGET);

usersRouter.post('/update', db.updateUserinfoPOST);

usersRouter.post('/search', db.queryUserinfo);

module.exports = usersRouter;