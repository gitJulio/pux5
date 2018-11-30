const pg = require('../../configuration/ps_connection');
const whi = require('../Proveedores/WHI/WHI-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const VehicleParse = require('../vehiculos/parserVehiculos');
/*
  Esta funcion obtiene las imagenes del proveedor WHI
*/
exports.getImagenes = async function(req, res, next) {

  let whi_img = await whi.SmartPageDataSearch(req.body).catch(err => {
    res.send(err)
  })
  res.send(whi_img)
}
