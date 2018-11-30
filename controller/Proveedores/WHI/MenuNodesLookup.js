let request = require('request')
const controller = require('./WHI-controller')
const Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.MenuNodesLookup = async function(p_idGrupo, p_vehiculo) {
  let whi = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.WHI)

  return new Promise((resolve, reject) => {
    let parametroNode;

    if (p_idGrupo) {
      parametroNode = `<par:ParentMenuNodeId>${p_idGrupo}</par:ParentMenuNodeId>`
    }

    let requestBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21" xmlns:ns1="http://whisolutions.com/PartSelectServ/2011-07-21">
                       <soapenv:Header/>
                       <soapenv:Body>
                          <par:MenuNodesLookup>
                             <par:PSRequestHeader>
                               <ns:SvcVersion>1.0</ns:SvcVersion>
                             </par:PSRequestHeader>
                             <par:MenuId>2</par:MenuId>
                             ${parametroNode}
                             <par:VehicleIdentifier>
                                <ns1:BaseVehicleId>${p_vehiculo.base_vehicle}</ns1:BaseVehicleId>
                                <ns1:EngineConfigId>${p_vehiculo.engine_id}</ns1:EngineConfigId>
                             </par:VehicleIdentifier>
                          </par:MenuNodesLookup>
                       </soapenv:Body>
                    </soapenv:Envelope>`;

    let requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'MenuNodesLookup',
      'content-type': 'text/xml;charset=UTF-8',
      'Authorization': whi.password
    };

    let requestOptions = {
      'method': 'POST',
      'url': whi.url,
      'headers': requestHeaders,
      'body': requestBody,
      'timeout': time.TIMEOUT.NIVEL1
    };

    request.post(requestOptions, async function(error, httpResponse, data) {
      if (!error) {

        if (httpResponse.statusCode == 200) {
          var json = await controller.toJson(data)
          resolve(json["soapenv:Envelope"]["soapenv:Body"]["tns:MenuNodesLookupResponse"]["tns:MenuNodes"]["pss:MenuNode"])
        } else {
          reject(error)
        }
      } else {
        reject(error)
      }
    })
  })
}
