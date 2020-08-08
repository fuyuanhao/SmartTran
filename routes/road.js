let express = require('express');
let roadRouter = express.Router();
let db = require('./pgHelper.js');

roadRouter.get('/', db.toBaogaoinfoManagement);

roadRouter.post('/', db.baogao);

module.exports = roadRouter;