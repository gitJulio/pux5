const pg = require('../../../configuration/ps_connection');
const request = require('request');
const Proveedores_config = require('../proveedores-config');

exports.getGenericArticlesByManufacturer6 = async function(p_id_vehiculo, p_id_grupo) {
  //Obtenemos los datos del proveedor
  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC)

  //Preparacion de la promesa
  return new Promise((resolve, rejec) => {

    //Preparando body de la promesa
    let body = {
      "getGenericArticlesByManufacturer6": {
        "articleCountry": "hn",
        "assemblyGroupNodeId": p_id_grupo,
        "brandNo": {
          "array": [
          ]
        },
        "lang": "es",
        "linkingTargetId": p_id_vehiculo,
        "linkingTargetType": "P",
        "provider": tecdoc.password
      }
    }

    // //Preparacion de request de la promesa
    let option = {
      url: tecdoc.url,
      json: body
    }

    // //Llamada de la promesa
    request.post(option, function(err, httpResponse, body) {
      if (!err) {
        if(httpResponse.statusCode == 200){
          if (body['data']['array']){
            resolve(body['data']['array'])
          }
          else {
            rejec('No data')
          }
        }else{
          rejec(err)
        }
      }else {
          reject(err)
      }
    })
  })
}
