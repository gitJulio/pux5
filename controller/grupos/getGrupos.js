const pg = require('../../configuration/ps_connection');
const tecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedores_config = require('../Proveedores/proveedores-config');
const partsCatalog = require('../Proveedores/Part-Catalog/Parts-Catalog-controller');
const request = require('request');
const whi = require('../Proveedores/WHI/WHI-controller');
const vehiculosParse = require('../vehiculos/parserVehiculos')
const GruposParser = require('./parserGrupos')

// Ver diagrama de flujo en documentacion
exports.getGrupos = async function(req, res, next) {

  let variable;
    let gruposApi =
      await pg.func('public.ft_get_alumnos', [5]).catch(err => {});

      console.log(variable);
      res.send(gruposApi);
};
//aaa
