const pg = require('../../configuration/ps_connection')
let request = require('request')

exports.getVersiones = async function(req, res, next) {
  //Ejecutamos la funcion de la base de datos para obtener las versiones de los autos en la DB ALLAS
  let gv = await pg.func('api_catalogo.ft_view_select_vehiculos_versiones').catch(err => {

    res.status(500).send({
      error: err,
      status: 500
    });

  })
  if (res.statusCode != 200) {

    return
  }

  res.send(gv)
}