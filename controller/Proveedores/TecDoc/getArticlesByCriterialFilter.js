const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getArticlesByCriterialFilter = async function(p_idGrupo, p_idVehiculo, p_idCriterial, p_rawValue, p_idPage) {

  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {})
  return new Promise((resolve, reject) => {
    let body;

    if (p_idVehiculo && p_idVehiculo != null) {
      body = {
        "getArticles": {
          "articleCountry": "hn",
          "provider": tecdoc.password,
          "assemblyGroupNodeIds": p_idGrupo,
          "criteriaFilters": {
            "criteriaId": p_idCriterial,
            "rawValue": String(p_rawValue)
          },
          "linkageTargetId": p_idVehiculo,
          "linkageTargetType": "p",
          "lang": "es",
          "perPage": 25,
          "page": p_idPage,
          "includeAll": true
        }
      }
    }else {
      body = {
        "getArticles": {
          "articleCountry": "hn",
          "provider": tecdoc.password,
          "assemblyGroupNodeIds": p_idGrupo,
          "criteriaFilters": {
            "criteriaId": p_idCriterial,
            "rawValue": String(p_rawValue)
          },
          "lang": "es",
          "perPage": 25,
          "page": p_idPage,
          "includeAll": true
        }
      }
    }

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
            reject(err)
          }
          reject(err)
        }
      }else {
        reject(err)
      }
    })
  })
}


exports.getArticlesByCriterialFilterOEM = async function(p_idCriterial, p_rawValue, p_idGrupo, p_idVehiculo, p_idPage) {

  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {})
  return new Promise((resolve, reject) => {
    let body;

    if (p_idVehiculo && p_idVehiculo != null) {
      body = {
        "getArticles": {
          "articleCountry": "hn",
          "provider": tecdoc.password,
          "assemblyGroupNodeIds": p_idGrupo,
          "criteriaFilters": {
            "criteriaId": p_idCriterial,
            "rawValue": String(p_rawValue)
          },
          "linkageTargetId": p_idVehiculo,
          "linkageTargetType": "p",
          "lang": "es",
          "perPage": 25,
          "page": p_idPage,
          "includeAll": true
        }
      }
    }

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
            reject(err)
          }
          reject(err)
        }
      }else {
        reject(err)
      }
    })
  })
}
