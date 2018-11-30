const pg = require('../../configuration/ps_connection')
let request = require('request')
let parts_catalog = require('../Proveedores/Part-Catalog/Parts-Catalog-controller')
var colors = require('colors');
//Funcion de obtener los motores desde PARTSCATALOG
exports.getFiltrosPartCatalog = async function(req, res, next) {
  // exports.getMotoresPcg = async function(req, res, next) {
  let p_filtros = await parts_catalog.getFiltros(req.params.id_marca, req.params.id_modelo_pcg, req.params.anio).catch(err => {

    res.status(500).send({
      error: err,
      status: 500
    });
  })
  if (res.statusCode != 200) {
    return
  }
  // console.log(req.params.parametros);
  ///------------------VARIABLES---------------------///
  p_filtros = JSON.parse(p_filtros);
  let regiones = [];
  let transmisiones = [];
  let motor = [];
  let velocidades = [];
  let json_final = [];
  ///------------------VARIABLES---------------------///

  try {
    regiones = p_filtros.filter(it => (it.key == "region"))[0]["values"]
  } catch (e) {}

  try {
    transmisiones = p_filtros.filter(it => (it.key == "transmissionType"))[0]["values"]
  } catch (e) {}

  try {
    motor = p_filtros.filter(it => (it.key == "filter_engine"))[0]["values"]
  } catch (e) {}

  json_final.push({
    "regiones": regiones,
    "transmisiones": transmisiones,
    "motor": motor
  })

  // regionesD = regionesD.concat(tipo_transmision = autosP["parameters"].filter(it => (it.key == "region"))[0]["value"])

  // res.send(p_filtros)
  // res.send(regiones)
  res.send(json_final)

}
