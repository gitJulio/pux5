let request = require('request')
const controller = require('./WHI-controller')
const Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.VehicleIdSearch = async function(baseV, enginec) {
  let whi = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.WHI)
  return new Promise((resolve, reject) => {
    var guiaVendedor = []
    var requestBody = `
              <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21" xmlns:ns1="http://whisolutions.com/PartSelectServ/2011-07-21">
                 <soapenv:Header/>
                 <soapenv:Body>
                    <par:VehicleIdSearch>
                       <par:PSRequestHeader>
                          <ns:SvcVersion>1.0</ns:SvcVersion>
                       </par:PSRequestHeader>
                       <par:VehicleIdentifier>
                       <ns1:BaseVehicleId>${baseV}</ns1:BaseVehicleId>
                       <ns1:EngineConfigId>${enginec}</ns1:EngineConfigId>
                       </par:VehicleIdentifier>
                           <par:RegionId>1</par:RegionId>
                           <!--0 to 7 repetitions:-->
                            <par:ResultOption>ATTRIB</par:ResultOption>
                           <par:ResultOption>ATTRIB_DESC</par:ResultOption>
                           <par:ResultOption>ATTRIB_TEXT</par:ResultOption>
                           <par:ResultOption>BASE_VEHICLE</par:ResultOption>
                           <par:ResultOption>BASE_VEHICLE_DESC</par:ResultOption>
                           <par:ResultOption>WHI_ENGINE</par:ResultOption>
                        </par:VehicleIdSearch>
                     </soapenv:Body>
                  </soapenv:Envelope>
           `; /*     <par:Part PartNumber="0031.10" MfrCode="PFN" PartTypeId="1684" PosGrpId="1" />     */
    var requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'VehicleIdSearch',
      'content-type': 'text/xml;charset=UTF-8',
      'Authorization': whi.password
    };
    var requestOptions = {
      'method': 'POST',
      'url': whi.url,
      'headers': requestHeaders,
      'body': requestBody,
      'timeout': time.TIMEOUT.NIVEL2

    };

    request.post(requestOptions, async function(error, httpResponse, data) {
      if (!error) {

        if (httpResponse.statusCode == 200) {
          let buyerg = data
          var json = await controller.toJson(buyerg)
          let vehiculos = json

          resolve(vehiculos)
        } else {

          if (error.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
            resolve("")
          }
          reject(error)
        }
      } else {
        reject(error)
      }
    })
  })
}
