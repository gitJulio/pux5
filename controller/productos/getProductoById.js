const pg = require('../../configuration/ps_connection');
const TecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const VehicleParse = require('../vehiculos/parserVehiculos');
const GruposParser = require('../grupos/parserGrupos');

exports.getProductoById = async function(req, res, next) {

  //***************************************************************************
  //-----------------------------Parseo de vehiculos --------------------------
  //***************************************************************************
  let id_articulo = req.body.id_articulo;
  let respuestaJson = []
  let articulos_allas;
  let articulos_tecdoc;
  let item;
  // **************************************************************************
  // ---------obtenemos la data de los articulos por proveedor-----------------
  // **************************************************************************
  switch (req.body.id_proveedor) {
    case Proveedor_conf.PROVEEDORES.ALLAS:
      articulos_allas = await pg.func('api_catalogo.ft_proc_get_producto_allas',
        [req.body.id_articulo, req.body.id_region]).catch((err) => {})
      articulos_allas = articulos_allas[0]["ft_proc_get_producto_allas"];
      respuestaJson = respuestaJson.concat(articulos_allas)
      break;

    case Proveedor_conf.PROVEEDORES.TECDOC:
      articulos_tecdoc =
        await TecDoc.getArticlesById(id_articulo).catch((err) => {})
      item = await pg.func('api_catalogo.ft_proc_convierte_articulo_from_tecdoc',
        [req.body.id_region, JSON.stringify(articulos_tecdoc)]).catch((err) => {})
      item = item[0]['ft_proc_convierte_articulo_from_tecdoc'];
      respuestaJson = respuestaJson.concat(item)
      break;

    case Proveedor_conf.PROVEEDORES.WHI:
      //  id_grupo_WHI = await GruposParser.WHI(grupos_api, 'id_source').catch((err) => {})
      break;
    case Proveedor_conf.PROVEEDORES.PARTCATALOG:
      break;
  }
  res.send(respuestaJson)
}