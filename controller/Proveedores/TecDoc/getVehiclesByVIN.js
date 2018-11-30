const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getVehiclesByVIN = async function(vint) {
  //Obtenemos los datos del proveedor
  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {
    res.send({
      error: err,
      status: 500
    })
  })
  return new Promise((resolve, reject) => {
    //Datos de conecion al proveedor
    let body = {
      "getVehiclesByVIN": {
        "country": "hn",
        "lang": "es",
        "vin": vint,
        "provider": tecdoc.password,
        "maxVehiclesToReturn": 1
      }
    }
    //Configuracion de coneccion al proveedor
    let option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL2
    }
    //Comienza la coneccion al proveedor para obtener la data
    request.post(option, function(err, httpResponse, body) {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(body['data'])
        } else {
          reject(err)
        }
      }else {
        reject(err)
      }
    })
  })
}
