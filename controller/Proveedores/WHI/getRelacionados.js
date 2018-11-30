let request = require('request')
const controller = require('./WHI-controller')
const Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getRelacionados = async function(p_vehiculo, p_idGrupo) {
  let whi = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.WHI)

  return new Promise((resolve, reject) => {
    var requestBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21" xmlns:ns1="http://whisolutions.com/PartSelectServ/2011-07-21">
                             <soapenv:Header/>
                             <soapenv:Body>
                                <par:RelatedPartTypeSearch>
                                   <par:PSRequestHeader>
                                      <ns:SvcVersion>1.0</ns:SvcVersion>
                                   </par:PSRequestHeader>
                                   <par:PartType Id="${p_idGrupo}"/>
                                   <par:VehicleIdentifier>
                                      <ns1:BaseVehicleId>${p_vehiculo.base_vehicle}</ns1:BaseVehicleId>
                                      <ns1:EngineConfigId>${p_vehiculo.engine_id}</ns1:EngineConfigId>
                                   </par:VehicleIdentifier>
                                </par:RelatedPartTypeSearch>
                             </soapenv:Body>
                          </soapenv:Envelope>`;

    var requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'RelatedPartTypeSearch',
      'content-type': 'text/xml;charset=UTF-8',
      'Authorization': whi.password
    };

    var requestOptions = {
      'method': 'POST',
      'url': whi.url,
      // 'qs': { 'wsdl': ''},
      'headers': requestHeaders,
      'body': requestBody,
      'timeout': 5000
    };

    request.post(requestOptions, async function(error, httpResponse, data) {
      if (!error) {
        if (httpResponse.statusCode == 200) {
          var json = await controller.toJson(data)
          resolve(json["soapenv:Envelope"]["soapenv:Body"]["tns:RelatedPartTypeSearchResponse"]["tns:RelPartTypes"]["pss:RelatedPartType"])
        } else {
          reject(error)
        }
      } else {
        reject(error)
      }
    })
  })
}
