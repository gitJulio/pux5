var express = require('express')
var router = express.Router()
var aportaciones = require('../controller/aportaciones/aportaciones-controller')
var mdAunt = require('../middleware/middleware-authentication')


/* uso de middleware */
router.use(mdAunt.content_type)
router.use(mdAunt.api_key)
router.use(mdAunt.token_validation)

/* POST page. */
router.post('/insertAportaciones', aportaciones.insertAportaciones)

module.exports = router
