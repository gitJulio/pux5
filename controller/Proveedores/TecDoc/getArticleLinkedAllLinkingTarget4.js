const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')
exports.getArticleLinkedAllLinkingTarget4 = async function(ar_id, linkin_targer_id) {

  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC)

  return new Promise((resolve, reject) => {

    let body = {
      "getArticleLinkedAllLinkingTarget4": {
        "articleCountry": "hn",
        "articleId": ar_id, //59537465,
        "country": "hn",
        "lang": "es",
        "linkingTargetId": linkin_targer_id, //23397,
        "linkingTargetType": "P",
        "provider": tecdoc.password
      }

    }

    let option = {
      url: tecdoc.url,
      json: body //,
      // timeout: time.TIMEOUT.NIVEL2 //Limite de tiempo de respuesta del proveedor para saber si hay internet
    }
    request.post(option, function(err, httpResponse, body) {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(body['data'])
        } else {
          //if (err.code=='ETIMEDOUT') {
          let dba = null
          resolve(dba)
          //}
        }
      }else {
        reject(err)
      }
    })
  })
}
