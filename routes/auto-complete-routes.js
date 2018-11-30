var express = require('express');
var router = express.Router();
var autoComplete = require('../controller/Allas-Search/allas-search-controller');
var mdAunt = require('../middleware/middleware-authentication');


/* uso de middleware */
router.use(mdAunt.content_type);
router.use(mdAunt.api_key);
router.use(mdAunt.token_validation);

/* Get smartSearch */
router.get('/:text_busqueda', autoComplete.autoComplete);

module.exports = router;
