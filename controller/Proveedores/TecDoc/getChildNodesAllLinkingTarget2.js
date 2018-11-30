const pg = require('../../../configuration/ps_connection')
const request = require('request')
const Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

//funcion para obtener los grupos de TecDoc
exports.getChildNodesAllLinkingTarget2 = async function(vehiculo, p_idGrupo) {
  let tecdoc = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.TECDOC)

  return new Promise((resolve, rejec) => {
    body = {
      "getChildNodesAllLinkingTarget2": {
        "linked": true,
        "linkingTargetId": vehiculo,
        "linkingTargetType": "P",
        "articleCountry": "hn",
        "lang": "es",
        "provider": tecdoc.password,
        "parentNodeId": p_idGrupo,
      }
    }

    if (body.getChildNodesAllLinkingTarget2.parentNodeId == null) {
      delete body.getChildNodesAllLinkingTarget2.parentNodeId
    }

    let option = {
      url: tecdoc.url,
      json: body,
      timeout: time.TIMEOUT.NIVEL1
    }
    //
    // request.post(option, function(err, httpResponse, body) {

    request.post(option, function(err, httpResponse, body) {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          try {
            resolve(body['data']['array'])
          } catch (e) {
            resolve()
          }
        } else {
          rejec(err)
        }
      } else {
        rejec(err)
      }
    })
  })
}


//******************************************************************************
//-----------------------------REFERENCIAS--------------------------------------
//******************************************************************************
//api-catalogo\controller\grupos\getGrupos.js
