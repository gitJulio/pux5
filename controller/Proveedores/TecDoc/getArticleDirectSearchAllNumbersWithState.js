const pg = require('../../../configuration/ps_connection');
var request = require('request');
var Proveedores_config = require('../proveedores-config');
const time = require('../../../configuration/timeout_niveles')
exports.getArticleDirectSearchAllNumbersWithState = async function(articleNumber) {

  //Obtenemos los datos del proveedor
  var tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch((err) => {})
  //Preparamos la promesa
  return new Promise((resolve, reject) => {

    var body = {
      "getArticleDirectSearchAllNumbersWithState": {
        "articleNumber": articleNumber,
        "numberType": "1",
        "searchExact": true,
        "articleCountry": "hn",
        "lang": "es",
        "provider": tecdoc.password
      }
    }
    //Preparamos el arreglo de consulta
    var option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL5
    }
    //Hacemos la llamada al proveedor
    request.post(option, (err, httpResponse, body) => {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          try {
            let ids = []
            let dd = body["data"]["array"]

            dd.forEach(it => {
              ids.push(
                it["articleId"]
              )
            })

            resolve(ids)
          } catch (e) {
            resolve()
          }
        } else {
          if (err.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
            resolve("")
          }
          reject(err);
        }
      }else {
      reject(err);
    }
    })
  })
  //@Carlos
}
