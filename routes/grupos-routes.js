var express = require('express')
var router = express.Router()
var grupos = require('../controller/grupos/grupos-controller')
// var mdAunt = require('../middleware/middleware-authentication')
//
// /* uso de middleware */
// router.use(mdAunt.content_type)
// router.use(mdAunt.api_key)
// router.use(mdAunt.token_validation)

/* GET grupos page. */
router.get('/getGroupRelacionados/:idgrupo?', grupos.getGroupRelacionados)
router.get('/getSearchGroup/:idgrupo?', grupos.getSearchGroup)



/* POST grupos page. */
router.post('/getGroupDiagramaView', grupos.getGroupDiagramaView)
router.post('/getGrupos', grupos.getGrupos)
router.post('/getGroupView', grupos.getGrupos)
router.post('/getGroupRelacionados', grupos.getGroupRelacionados)

module.exports = router
