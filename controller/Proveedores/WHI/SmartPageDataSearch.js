let request = require('request')
const controller = require('./WHI-controller')
const Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.SmartPageDataSearch = async function(array_to_smartpage) {
  let whi = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.WHI)

  return new Promise((resolve, reject) => {
    var peti = []

    for (var j = 0; j < array_to_smartpage.length; j++) {

      peti = peti.concat(`<par:Item PartNumber="${array_to_smartpage[j]["p_number"]}" MfrCode="${array_to_smartpage[j]["mdf_code"]}"/>`)

    }
    let cabio = peti.toString()

    var nuevaCadena, resultado_parseo, resul_p

    nuevaCadena = cabio.replace(/"</i, "");

    resultado_parseo = nuevaCadena.replace(/,/i, "");

    resul_p = resultado_parseo.replace(/>,</i, "><");

    var url_img = []
    var requestBody = `
              <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21">
              <soapenv:Header/>
                 <soapenv:Body>
                    <par:SmartPageDataSearch>
                       <par:PSRequestHeader>
                          <ns:SvcVersion>1.0</ns:SvcVersion>
                       </par:PSRequestHeader>
                       ${resul_p}
                       <par:DataOption>ALL</par:DataOption>
                    </par:SmartPageDataSearch>
                 </soapenv:Body>
              </soapenv:Envelope>
             `;

    var requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'SmartPageDataSearch',
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
      let img_d = []
      if (!error) {
        if (httpResponse.statusCode == 200) {

          let img = data

          var json_img = await controller.toJson(img)

          let dat = json_img["soapenv:Envelope"]["soapenv:Body"]["tns:SmartPageDataSearchResponse"]["tns:Items"]["pss:Item"]

          let datosimg = await dat.map(ii => {
            return {

              mrf: ii["MfrCode"],

              npart: ii["pss:Part"]["pss:PartNumber"],

              thumbnail: ii["pss:PrimaryImg"]["pss:ThumbUrl"]
            }
          })

          resolve(datosimg)

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
