let request = require('request')
const controller = require('./WHI-controller')
const Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.BuyersGuideSearch = async function(partnumber, mfrcode, parttypeid, posgrpid) {
  let whi = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.WHI)
  return new Promise((resolve, reject) => {
    var guiaVendedor = []
    var grupo_posicion = "";
    if (posgrpid != null || grupo_posicion != "") {
      grupo_posicion = `PosGrpId="${posgrpid}"`
    }

    var requestBody = `
                  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21">
                    <soapenv:Header/>
                          <soapenv:Body>
                          <par:BuyersGuideSearch>
                              <par:PSRequestHeader>
                                <ns:SvcVersion>1.0</ns:SvcVersion>
                              </par:PSRequestHeader>
                          <par:Part PartNumber="${partnumber}" MfrCode="${mfrcode}" PartTypeId="${parttypeid}" ${grupo_posicion} />
                          </par:BuyersGuideSearch>
                          </soapenv:Body>
                    </soapenv:Envelope>
                  <soapenv:Body>
               `;
    var requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'BuyersGuideSearch',
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

    request.post(requestOptions, async function(err, httpResponse, data) {
      if (!err) {
        if (httpResponse.statusCode == 200) {
          let buyerg = data

          var json = await controller.toJson(buyerg)
          try {
            var vehiculos = json["soapenv:Envelope"]["soapenv:Body"]["tns:BuyersGuideSearchResponse"]["tns:BuyersGuideData"]["pss:Apps"]["pss:Make"]
          } catch (e) {
            reject(err)
          } finally {}
          resolve(vehiculos)
        } else {
          if (error.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
            resolve("")
          }
          reject(err);
        }
      } else {
        reject(err)
      }
    })
  })
}
