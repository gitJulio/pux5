const pg = require('../../configuration/ps_connection')
const request = require('request')
const parts_catalog = require('../Proveedores/Part-Catalog/getMarcas')

exports.getMarcas = async function(req, res, next) {
  //SI se envia un TRUE en los parametros  ejecutara la solicitud al proveedor parts_catalog
  if (req.params.es_part_catalog) {

    parts_catalog.getMarcas().then(data => {
      res.send(JSON.parse(data))
    }).catch(err => {
      res.send(err)
    })

  } else {
    //Si no se envia un TRUE en los parametros ejecutara la consulta a la base de datos ALLAS
    let dba = await pg.func('api_catalogo.ft_view_select_vehiculos_marcas').catch(err => {

      res.status(500).send({
        error: err,
        status: 500
      });

    })
    if (res.statusCode != 200) {
      return
    }
    res.send(dba)
  }
}
