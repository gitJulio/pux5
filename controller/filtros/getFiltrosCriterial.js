const request = require('request')
const pg = require('../../configuration/ps_connection');
const TecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const VehicleParse = require('../vehiculos/parserVehiculos');
const GruposParser = require('../grupos/parserGrupos');

exports.getFiltrosCriterial = async function(req, res, next) {

  //-----------------------------------------------------------------------//
  //***************************Declarado de Variables *********************//
  //----------------------------------------------------------------------//
  let data = []
  let grupos_api =
    await pg.func('api_catalogo.ft_proc_obtiene_grupo_api', req.body.id_grupo).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })

  if (res.statusCode != 200) return;
  //*******************************************************************//
  //-------------Obtenemos el grupo y el vehiculo de TECDOC***********//
  //------------------------------------------------------------------//
  let vehiculo_tecdoc = await VehicleParse.TECDOC(req.body.vehiculos, 'id')
  let id_grupo_TecDoc = await GruposParser.TECDOC(grupos_api, 'id')

  //*****************************************************************//
  //-------------Guardamos el resultado de tecdoc--------------------//
  //-----------------------------------------------------------------//
  let articulos_tecdoc =
    await TecDoc.getArticleCriterial(id_grupo_TecDoc, vehiculo_tecdoc, req.body.id_pagina, req.body.id_criterial, req.body.row_value).catch(err => {
      console.log(err);
    })
  //****************************************************************//
  //------------Insertamos en data el resultado de tecdoc-----------//
  //----------------------------------------------------------------//
  // res.send(data)
  data.push(articulos_tecdoc);
  let allasJson =
    await pg.func('api_catalogo.ft_proc_convierte_criterial_from_tecdoc', [JSON.stringify(data), req.body.id_region]).catch((err) => {
      console.log(err);
    })
  res.send(allasJson[0]["ft_proc_convierte_criterial_from_tecdoc"])
};
