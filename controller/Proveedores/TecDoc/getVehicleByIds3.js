const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')
exports.getVehicleByIds3 = async function(carids) {
  //Obtenemos los datos del proveedor
  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {
    res.send({
      error: err,
      status: 500
    })
  })
  return new Promise((resolve, reject) => {
    //Datos que se le envian al provedor para obtener respuesta de la data que necesitamos
    let body = {
      "getVehicleByIds3": {
        "articleCountry": "hn",
        "carIds": {
          "array": carids
        },
        "countriesCarSelection": "hn",
        "country": "hn",
        "lang": "es",
        "provider": tecdoc.password
      }
    }

    //Configuracion de la coneccion
    let option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL3
    }
    //Comienza la coneccion al proveedor
    request.post(option, function(err, httpResponse, body) {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(body['data'])
        } else {
          if (error.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
            resolve("")
          }
          rejec(err)
        }
      }else {
        reject(err)
      }
    })
  })
}
