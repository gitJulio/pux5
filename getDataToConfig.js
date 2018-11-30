const request = require('request')
var colors = require('colors');
let Proveedores_config = require('./controller/Proveedores/proveedores-config')
var parser = require('fast-xml-parser');
var he = require('he');
var fs = require('fs');
let data_bases = fs.readFileSync('eng_sub.json', 'utf8');

exports.getEngines = async function(req, res, next) {
  var fechaHora = new Date();

  var horas = fechaHora.getHours();
  var minutos = fechaHora.getMinutes();
  var segundos = fechaHora.getSeconds();

  var hh = horas
  var min = minutos
  var seg = segundos

  let t_inicio = `${horas} : ${minutos} : ${segundos}`


  let jsonEnd = []
  let c_bases = data_bases;
  let ArrayBases = JSON.parse(c_bases);

  let empty = []
  let resultado = await recursividadFumanda(ArrayBases, empty, ArrayBases.length + 1, 0).catch((err) => {
    console.log('catch de res');
    console.log(err);
  })



  var fechaHora1 = new Date();

  var horas2 = fechaHora1.getHours();
  var minutos2 = fechaHora1.getMinutes();
  var segundos2 = fechaHora1.getSeconds();

  var hh1 = horas2 - hh
  var min1 = minutos2 - min
  var seg1 = segundos2 - seg

  let t_fin1 = `${horas2} : ${minutos2} : ${segundos2}`

  let t_fin = `${hh1} : ${min1} : ${seg1}`
  console.log(`Tiempo Ini: ${t_inicio}`);
  console.log(`Tiempo Fin : ${t_fin1}`);
  console.log(`Tiempo tardado: ${t_fin}`);




  res.send(resultado)
}

function recursividadFumanda(p_array, p_result, p_array_length_old, conta_ol) {
  return new Promise((resolve, reject) => {

    console.log(`Tamanio de recursividas ${p_array.length}`);


    let jsonEnd = []
    let appResult = []
    let promesas = []
    console.log(`new ${p_array.length}`);
    console.log(`old ${p_array_length_old}`);
    console.log(`Diferencia: -- ${p_array_length_old-p_array.length}\n`)

    if (p_array.length == p_array_length_old) {
      conta_ol++
      console.log(conta_ol);
      if (conta_ol == 5) {
        console.log(p_array);
        resolve(p_result)
      }

    } else {
      conta_ol = 0
    }

    p_array.forEach(item => {
      promesas.push(getData(item))
    })

    Promise.all(promesas).then((data) => {
      data.forEach(item => {
        if (Array.isArray(item)) {
          jsonEnd = jsonEnd.concat(item)
        } else {
          jsonEnd.push(item)
        }
      })

      //Preparacion de siguiente recursividad
      let nueva_carga = []
      jsonEnd.forEach(item => {
        try {
          if (item.A) {
            nueva_carga.push(item)
          } else {
            p_result.push(item);
          }
        } catch (e) {}
      })

      if (nueva_carga.length > 0) {
        resolve(recursividadFumanda(nueva_carga, p_result, p_array.length, conta_ol));
      } else {
        console.log('llego');
        resolve(p_result)
      }
    })
  })
}

let it = 0;
let it2 = 0;
async function getData(p_base) {
  return new Promise((resolve, reject) => {
    var requestBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21" xmlns:ns1="http://whisolutions.com/PartSelectServ/2011-07-21">
                         <soapenv:Header/>
                         <soapenv:Body>
                            <par:VehicleIdSearch>
                               <par:PSRequestHeader>
                                  <ns:SvcVersion>1.0</ns:SvcVersion>
                               </par:PSRequestHeader>
                               <par:VehicleIdentifier>
                                  <ns1:BaseVehicleId>${p_base.A}</ns1:BaseVehicleId>
                                  <ns1:EngineConfigId>${p_base.C}</ns1:EngineConfigId>
                               </par:VehicleIdentifier>
                               <par:Criterion Attrib="SUB_MODEL" Id="${p_base.B}"/>
                               <par:Criterion Attrib="REGION" Id="${p_base.D}"/>
                               <par:RegionId>1</par:RegionId>
                               <par:RegionId>3</par:RegionId>
                               <par:ResultOption>WHI_ENGINE</par:ResultOption>
                            </par:VehicleIdSearch>
                         </soapenv:Body>
                      </soapenv:Envelope>`;

    var requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'VehicleIdSearch',
      'content-type': 'text/xml;charset=UTF-8',
      'Authorization': 'Basic RDUwMTk0ODU5RjYzNDY2Nzg4NkI3MEVEODRDRTIyNTgtQTQxMEM2MjBBMERENDZGOEI1OUJDNEEyQkFFNDZCOTY6N0FCMzU3NjYtMDM3OS00REYwLTk2NjUtREFFRTEzODIyRjQz'
    };

    var requestOptions = {
      'method': 'POST',
      'url': 'http://acespssint.nexpart.com:4001/partselect/1.0/services/PartSelectService.PartSelectHttpSoap11Endpoint',
      'headers': requestHeaders,
      'body': requestBody
    };

    request(requestOptions, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        let xmlData = response["body"]

        var options = {
          attributeNamePrefix: "",
          // attrNodeName: "attr",
          textNodeName: "text",
          ignoreAttributes: false,
          ignoreNameSpace: false,
          allowBooleanAttributes: false,
          parseNodeValue: true,
          parseAttributeValue: false,
          trimValues: true,
          cdataTagName: "__cdata",
          cdataPositionChar: "\\c",
          localeRange: "",
          parseTrueNumberOnly: false,
          attrValueProcessor: a => he.decode(a, {
            isAttributeValue: true
          }),
          tagValueProcessor: a => he.decode(a)
        };

        var jsonObj = parser.parse(xmlData, options);

        try {
          let result = jsonObj['soapenv:Envelope']['soapenv:Body']['tns:VehicleIdSearchResponse']['tns:VehicleDetail'];

          if (Array.isArray(result)) {
            result.forEach(item => {
              item['sub_version'] = p_base.B
              item['engine_id_send'] = p_base.C
            })
          } else {
            result['sub_version'] = p_base.B
            result['engine_id_send'] = p_base.C
          }

          resolve(result)
        } catch (e) {

          if (jsonObj['soapenv:Envelope']['soapenv:Body']['tns:VehicleIdSearchResponse']['tns:PSResponseHeader']['psc:StatusCode'] == 'failure') {
            resolve()
          } else {
            resolve(p_base)
          }
        }
      } else {
        if (jsonObj) {
          console.log(`saperoco: ${p_base}`);
          resolve(p_base)
        } else {
          resolve(p_base)
        }
      }
    })
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
