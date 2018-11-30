var express = require('express');
var router = express.Router();
var filtros = require('../controller/filtros/filtros-controller')
var mdAunt = require('../middleware/middleware-authentication');

/* uso de middleware */
router.use(mdAunt.content_type);
router.use(mdAunt.api_key);
router.use(mdAunt.token_validation);

/* GET filtros page. */
router.get('/getFiltrosPartCatalog/:id_marca/:id_modelo_pcg/:anio', filtros.getFiltrosPartCatalog)
// router.get('/getFiltrosPartCatalog/:id_marca/:id_modelo_pcg/:anio/:pagina', filtros.getFiltrosPartCatalog)

/* POST filtros*/
router.post('/getGruposAtributos', filtros.getGruposAtributos)
router.post('/getFiltrosCriterial', filtros.getFiltrosCriterial)

module.exports = router;
