let express = require('express')
let router = express.Router()
let vehiculos = require('../controller/vehiculos/vehiculos-controller')
let mdAunt = require('../middleware/middleware-authentication')

/* uso de middleware */
router.use(mdAunt.content_type)
router.use(mdAunt.api_key)
router.use(mdAunt.token_validation)

/* GET home page. */
router.get('/getAnios/', vehiculos.getAnios)
router.get('/getMarcas/:es_part_catalog?', vehiculos.getMarcas)
router.get('/getModelos/:id_marca/:es_part_catalog?', vehiculos.getModelos)
router.get('/getMotores/:id_modelo/:id_modelo_anio', vehiculos.getMotores)
router.get('/getVersiones', vehiculos.getVersiones)
router.get('/getVehiculoPartCatalog/:id_marca/:id_modelo_pcg/:anio/:pagina/:parametros', vehiculos.getMotoresPcg)
router.get('/getDecodeVin/:vin/:es_part_catalog?', vehiculos.getVin)
router.get('/getVehiculoById/:id_vehiculo', vehiculos.getMotorById)
router.post('/getBuyerGuie/', vehiculos.getBuyerGuie)
router.post('/getVehiculoByIdP/', vehiculos.getVehiculoIdP)
router.post('/cambiarTimeOut', vehiculos.cambiarTimeOut);
module.exports = router
