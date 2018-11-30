const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getArticlesState = async function(p_oem, p_idPage) {
  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {})

  return new Promise((resolve, reject) => {

    let body = {
      "getArticles": {
        "articleCountry": "hn",
        "provider": tecdoc.password,
        "searchQuery": p_oem,
        "searchType": 1,
        "lang": "es",
        "perPage": 25,
        "page": p_idPage,
        "includeAll": true
      }
    }

    body = NullsJson(body)
    let option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL5
    }

    request.post(option, (err, httpResponse, data) => {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(data['articles'])
        } else {
          if (err.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
            resolve("")
          }
          reject(err)
        }
      }else {
        reject(err)
      }
    })
  })
}
//@Carlos
function NullsJson(p_json) {

  if (!p_json.getArticles.legacyArticleIds || p_json.getArticles.legacyArticleIds == null) {
    delete p_json.getArticles.legacyArticleIds
  }

  if (!p_json.getArticles.assemblyGroupNodeIds || p_json.getArticles.assemblyGroupNodeIds == null) {
    delete p_json.getArticles.assemblyGroupNodeIds
  }

  if (!p_json.getArticles.linkageTargetId || p_json.getArticles.linkageTargetId == null) {
    delete p_json.getArticles.linkageTargetId
  }
  return p_json
}
