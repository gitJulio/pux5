const pg = require('../../configuration/ps_connection')
let request = require('request')
let parts_catalog = require('../Proveedores/Part-Catalog/Parts-Catalog-controller')
var colors = require('colors');
//Funcion de obtener los motores desde PARTSCATALOG
exports.getFiltrosWHI = async function(req, res, next) {

let regiones=[1,3]
  filtros.push({ //Llenamos los filtros
    regiones,
    trasmisiones,
    motores,
    velocidades
  })

  res.send(filtros) //Resolvemos la data
}
