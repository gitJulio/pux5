const pg = require('../../../configuration/ps_connection');
var request = require('request');
var Proveedores_config = require('../proveedores-config');

exports.getAssignedArticlesByIds6 = async function (p_articles, p_id_vehiculo) {
  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err=>{
     res.send({ error: err,status:500})
    })

  return new Promise((resolve, reject)=>{
    let body =     {
      "getAssignedArticlesByIds6": {
        "articleCountry": "hn",
        "articleIdPairs": {
          "array": p_articles
        },
        "attributs": true,
        "basicData": true,
        "eanNumbers": true,
        "immediateAttributs": true,
        "immediateInfo": true,
        "info": true,
        "lang": "es",
        "linkingTargetId": p_id_vehiculo,
        "linkingTargetType": "p",
        "oeNumbers": true,
        "provider": tecdoc.password,
        "replacedByNumbers": true,
        "replacedNumbers": true,
        "thumbnails": true,
        "usageNumbers": true
      }
    }

    let option={
      url: tecdoc.url,
      json: body
    }

    request.post(option, function(err, httpResponse, data) {
      if (!err) {
        if(httpResponse.statusCode == 200){
          resolve(data)
        }else{
          reject(data)
        }
      }else {
        reject(err)
      }
    })

  })
}
