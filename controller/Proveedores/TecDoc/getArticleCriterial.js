const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')


exports.getArticleCriterial = async function(p_idGrupo, p_id_vehiculo, p_idCriterial, p_rawValue) {
  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC).catch(err => {})

  return new Promise((resolve, reject) => {
    let body;

    if (p_idCriterial != null && p_idCriterial != 0 && p_rawValue != null && p_rawValue != 0) {

      body = {
        "getArticles": {
          "articleCountry": "hn",
          "provider": tecdoc.password,
          "assemblyGroupNodeIds": p_idGrupo,
          "criteriaFilters": {
            "criteriaId": p_idCriterial,
            "rawValue": String(p_rawValue)
          },
          "linkageTargetId": p_id_vehiculo,
          "linkageTargetType": "p",
          "lang": "es",
          "perPage": 25,
          "Page": 1,
          "includeDataSupplierFacets": true,
          "includeCriteriaFacets": true
        }
      }

    } else {
      body = {
        "getArticles": {
          "articleCountry": "hn",
          "provider": tecdoc.password,
          "assemblyGroupNodeIds": p_idGrupo,
          "linkageTargetId": p_id_vehiculo,
          "linkageTargetType": "p",
          "lang": "es",
          "perPage": 1,
          "Page": 1,
          "includeDataSupplierFacets": true,
          "includeCriteriaFacets": true
        }
      }
    }

    body = NullsJson(body)
    let option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL1
    }
    console.log('entro ');
    request.post(option, (err, httpResponse, data) => {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          console.log('resolvio');
          resolve(data)
        } else {
          reject(err)
        }
      } else {
        reject(err)
      }
    })
  })
}

function NullsJson(p_json) {
  if (!p_json.getArticles.legacyArticleIds || p_json.getArticles.legacyArticleIds == null) {
    delete p_json.getArticles.legacyArticleIds
  }

  if (!p_json.getArticles.assemblyGroupNodeIds || p_json.getArticles.assemblyGroupNodeIds == null) {
    delete p_json.getArticles.assemblyGroupNodeIds
  }

  if (!p_json.getArticles.linkageTargetId || p_json.getArticles.linkageTargetId == null) {
    delete p_json.getArticles.linkageTargetId
    delete p_json.getArticles.linkageTargetType
  }
  return p_json
}
