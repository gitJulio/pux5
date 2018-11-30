const pg = require('../../configuration/ps_connection')
let request = require('request')
let parts_catalog = require('../Proveedores/Part-Catalog/Parts-Catalog-controller')

exports.getModelos = async function(req, res, next) {
  //Si se envia TRUE en los parametros de ejecutara la solicitud al proveedor PARTSCATALOG
  if (req.params.es_part_catalog) {
    let respuesta = await parts_catalog.getModelos(req.params.id_marca).catch((err) => {
    })

    if (respuesta) {
      res.send(JSON.parse(respuesta))
    }else {
      res.status(500).send({
        error: 'Finalizado',
        status: 500
      });

      if (res.statusCode != 200) return
    }

  } else {
    //Si no se envia un TRUE en los parametros se ejecutara la solicitud a la DB allas
    let vm = await pg.func('api_catalogo.ft_view_select_vehiculos_modelos_por_marca', req.params.id_marca).catch(err => {

      res.status(500).send({
        error: err,
        status: 500
      });

    })

    if (res.statusCode != 200) {
      return
    }

    res.send(vm) //Enviamos la data
  }
}
