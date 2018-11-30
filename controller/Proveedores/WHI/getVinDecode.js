let request = require('request')
const controller = require('./WHI-controller')
const Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getVinDecode = async function(vin) {
  let whi = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.WHI)
  return new Promise((resolve, reject) => {

    var requestBody = `
              <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21">
                 <soapenv:Header/>
                 <soapenv:Body>
                    <par:VINDecode>
                       <par:PSRequestHeader>
                          <ns:SvcVersion>1.0</ns:SvcVersion>
                       </par:PSRequestHeader>
                       <par:VIN>${vin}</par:VIN>
                       <!--0 to 5 repetitions:-->
                       <par:VINDecodeOption>BASE_VEHICLE</par:VINDecodeOption>
                       <par:VINDecodeOption>BASE_VEHICLE_DESC</par:VINDecodeOption>
                    </par:VINDecode>
                 </soapenv:Body>
              </soapenv:Envelope>
           `;
    var requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'VINDecode',
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
          let vin = data
          var json = await controller.toJson(vin)
          resolve(json)
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
