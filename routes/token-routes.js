var express = require('express');
var router = express.Router();
var token = require('../controller/token/token-controller');
var mdAunt = require('../middleware/middleware-authentication');

/* Llamadas a middleware globales */
router.use(mdAunt.content_type);
router.use(mdAunt.api_key);

/* GET token */
router.post('/gettoken', token.getToken);

module.exports = router;
