const pg = require('../../configuration/ps_connection');
const TecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const VehicleParse = require('../vehiculos/parserVehiculos');
const config = require('../../configuration/config');

exports.getProductosByOem = async function(req, res, next) {
  //**********************Consultas a proveedores*******************************
  let articulos_tecdoc =
    await TecDoc.getArticlesState(req.body.id_oem, req.body.id_page).catch((err) => {
  })
  console.log(articulos_tecdoc.length);
  let articulos_allas;
  if (req.body.id_page == 1) {
    articulos_allas =
      await pg.func('api_catalogo.ft_proc_get_productos_allas_v2_oem', [req.body.id_oem, req.body.id_region]).catch((err) => {
        console.log(err);
    })
  }

  //*****************************PARSEO*****************************************
  let item =
    await pg.func('api_catalogo.ft_proc_convierte_articulos_from_tecdoc',
    [ req.body.id_grupo,
      req.body.id_region,
      JSON.stringify(articulos_tecdoc),
      "0",
      req.body.id_oem]).catch((err) => {
      console.log(err);
    })

    //*************************************MERGE********************************
    let mijson = []
    try {
      if (articulos_allas[0]["ft_proc_get_productos_allas_v2_oem"] != null) {
        mijson = mijson.concat(articulos_allas[0]["ft_proc_get_productos_allas_v2_oem"])
      }
    } catch (e) {}

    try {
      if (item[0]['ft_proc_convierte_articulos_from_tecdoc'] != null) {
        mijson = mijson.concat(item[0]['ft_proc_convierte_articulos_from_tecdoc'])
      }
    } catch (e) {}

    res.send(mijson)
}
//@Carlos
