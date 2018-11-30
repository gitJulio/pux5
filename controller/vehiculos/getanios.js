const pg = require('../../configuration/ps_connection')

exports.getAnios = async function(req, res, next) {
  //Establecemos coneccion a la base de datos para ejecutar la funcion de obtener los años en la db
  let anio = await pg.func('api_catalogo.ft_view_select_anios').catch(err => {

    res.status(500).send({
      error: err,
      status: 500
    });

  })

  if (res.statusCode != 200) {
    return
  }

  res.send(anio)
}
