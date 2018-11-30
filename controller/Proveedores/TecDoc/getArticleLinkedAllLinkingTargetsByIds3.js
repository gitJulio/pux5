const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getArticleLinkedAllLinkingTargetsByIds3 = async function(ar_id, articulos_array) {
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
      "getArticleLinkedAllLinkingTargetsByIds3": {
        "articleCountry": "hn",
        "articleId": ar_id,
        "lang": "es",
        "linkedArticlePairs": {
          "array": articulos_array
        },
        "linkingTargetType": "P",
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
    request.post(option, async function(err, httpResponse, body) {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          let autos_id_guia = [];
          let vv = await body['data']["array"].map(i => i["linkedVehicles"]["array"][0]["carId"])
          resolve(vv);
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
