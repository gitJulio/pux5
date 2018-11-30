const pg = require('../../../configuration/ps_connection');
var request = require('request');
var Proveedores_config = require('../proveedores-config');

exports.getArticleIdsWithState = async function(p_IdGenericArticle, p_IdAssemblyGroupNode, p_Vehiculo) {

  //Obtenemos los datos del proveedor
  var tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch((err) => {

  })

  //Preparamos la promesa
  return new Promise((resolve, reject) => {

    if (!tecdo) return

    var body = {
      "getArticleIdsWithState": {
        "articleCountry": "hn",
        "assemblyGroupNodeId": p_IdAssemblyGroupNode,
        "genericArticleId": {
          "array": p_IdGenericArticle
        },
        "lang": "es",
        "linkingTargetId": p_Vehiculo,
        "linkingTargetType": "P",
        "provider": tecdoc.password
      }
    }
    //Preparamos el objeto de consulta
    var option = {
      url: tecdoc.url,
      json: body
    }
    //Hacemos la llamada al proveedor
    request.post(option, (err, httpResponse, body) => {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(body);
        } else {
          reject(err);
        }
      }else {
        reject(err)
      }
    })
  })
}
