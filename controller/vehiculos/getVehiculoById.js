const pg = require('../../configuration/ps_connection')
let request = require('request')

exports.getMotorById = async function(req, res, next) {
  //Establecemos coneccion a la base de datos y ejecutamos la funcion query en ella enviadole
  let gmb = await pg.func('api_catalogo.ft_view_select_motores_por_id_motor', req.params.id_vehiculo).catch(err => {
    res.status(500).send({
      error: err,
      status: 500
    });
  })

  if (res.statusCode != 200) {
    return
  }
  let vacio = [
    {
      "status": 200,
      "mensaje": "El vehiculo que esta solicitando no existe"
    }
  ]
  if (gmb == null) {
    res.send(vacio)
  } else {

    res.send(gmb)
  }
}
