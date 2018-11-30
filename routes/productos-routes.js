var express = require('express');
var router = express.Router();
var productos = require('../controller/productos/productos-controller');
var mdAunt = require('../middleware/middleware-authentication');

/* uso de middleware */
router.use(mdAunt.content_type);
router.use(mdAunt.api_key);
router.use(mdAunt.token_validation);

/* GET productos page. */

/* POST  prodductos page*/
router.post('/getProductoByGrupo', productos.getProductoByGrupo);
router.post('/getProductoById', productos.getProductoById);
router.post('/getPartesCatalog', productos.getPartesCatalog);
router.post('/getProductosByOem/', productos.getProductosByOem);
router.post('/getProductosByAtributos/', productos.getProductosByAtributos);
router.post('/getProductosByFilter/', productos.getArticlesByCriterialFilter);

module.exports = router;
