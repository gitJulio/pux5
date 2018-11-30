const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getArticlesAtributos = async function(id_grupo) {

  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {})
  return new Promise((resolve, reject) => {

    if (id_grupo == 0 || !id_grupo) reject()

    let body = {
      "getArticles": {
        "articleCountry": "hn",
        "provider": tecdoc.password,
        "assemblyGroupNodeIds": id_grupo,
        "lang": "es",
        "includeCriteriaFacets": true
      }
    }

    body = NullsJson(body)
    let option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL6
    }

    request.post(option, (err, httpResponse, data) => {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(data)
        } else {
          if (err.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
            reject()
          }
          reject(err)
        }
      }else {
        reject(err)
      }
    })
  })
}

//******************************************************************************
//-----------SEGUNDA FUNCION DE PETICION CON LOS CRITERIAL Y LOS RAW------------
//******************************************************************************
exports.getArticlesAtributos2 = async function(id_criterial, rawvalue, id_grupo, p_idPage) {

  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {})
  return new Promise((resolve, reject) => {
    let body = {
      "getArticles": {
        "articleCountry": "hn",
        "provider": tecdoc.password,
        "assemblyGroupNodeIds": id_grupo,
        "criteriaFilters": {
          "criteriaId": id_criterial,
          "rawValue": rawvalue
        },
        "lang": "es",
        "perPage": 10,
        "page": p_idPage,
        "includeAll": true
      }
    }

    body = NullsJson(body)
    let option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL6
    }
    request.post(option, (err, httpResponse, data) => {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          resolve(data["articles"])
        } else {
          if (err.code == 'ETIMEDOUT') {
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
