const request = require('request')
const controller = require('./WHI-controller')
const Proveedores_config = require('../proveedores-config')
const pg = require('../../../configuration/ps_connection')

exports.ApplicationSearchByFilter = async function(p_idGrupoWHI, p_VehiculoWHI, p_criterial) {
  let whi = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.WHI)

  return new Promise((resolve, reject) => {
    let bodyRaw = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:par="http://whisolutions.com/PartSelectService-v1" xmlns:ns="http://whisolutions.com/PartSelectCommon/2011-07-21" xmlns:ns1="http://whisolutions.com/PartSelectServ/2011-07-21">
                     <soapenv:Header/>
                     <soapenv:Body>
                        <par:ApplicationSearch>
                           <par:PSRequestHeader>
                              <ns:SvcVersion>1.0</ns:SvcVersion>
                           </par:PSRequestHeader>
                           <par:VehicleIdentifier>
                              <ns1:BaseVehicleId>${p_VehiculoWHI.base_vehicle}</ns1:BaseVehicleId>
                              <ns1:EngineConfigId>${p_VehiculoWHI.engine_id}</ns1:EngineConfigId>
                           </par:VehicleIdentifier>
                           <par:LocationId>1</par:LocationId>

                           <par:PartType Id="${p_idGrupoWHI}"/>

                           <par:RegionId>1</par:RegionId>
                           <par:RegionId>3</par:RegionId>

            		           <par:AppOption>ATTRIB</par:AppOption>
                         	 <par:AppOption>ASSET</par:AppOption>
                         	 <par:AppOption>ATTRIB_NOTE</par:AppOption>
                         	 <par:AppOption>ATTRIB_NOTE_SHORT</par:AppOption>
                         	 <par:AppOption>CONSOLIDATE</par:AppOption>
                         	 <par:AppOption>QUAL</par:AppOption>
                         	 <par:AppOption>URI</par:AppOption>
                         	 <par:AppOption>SP_URI</par:AppOption>
                         	 <par:AppOption>WHI_ENGINE</par:AppOption>
                         	 <par:AppOption>MKTG_NAME</par:AppOption>
                         	 <par:AppOption>WEIGHT_DIMEN</par:AppOption>

                		       <par:Criterion Attrib="${p_criterial.id_criterial}" Id="${p_criterial.raw_value}"/>

                         	<par:PartTypeDescOption>BOTH</par:PartTypeDescOption>
                        </par:ApplicationSearch>
                     </soapenv:Body>
                  </soapenv:Envelope>`;

    var requestHeaders = {
      'cache-control': 'no-cache',
      'soapaction': 'ApplicationSearch',
      'content-type': 'text/xml;charset=UTF-8',
      'Authorization': whi.password
    };

    var requestOptions = {
      'method': 'POST',
      'url': whi.url,
      'headers': requestHeaders,
      'body': bodyRaw,
      'timeout': 2000
    };

    request.post(requestOptions, async function(error, httpResponse, data) {
      if (!error) {
        if (httpResponse.statusCode == 200) {
          let response = await controller.toJson(data)
          try {

            let resultado = response['soapenv:Envelope']['soapenv:Body']['tns:ApplicationSearchResponse']['tns:Apps']['pss:ConsApp']

            // Preparacion para get imagenes
            let ids = resultado.map((item) => {
              if (item['pss:SPAppData']['Img'] == 'Y') {
                return {
                  p_number: item['pss:Part'],
                  mdf_code: item['pss:MfrCode']

                }
              }
            })

            let img = await controller.SmartPageDataSearch(ids).catch((err) => {})


            resultado.forEach(item => {
              try {
                let tbh = (img.filter((itemImg) => itemImg['mrf'] == item['pss:MfrCode'] && itemImg['npart'] == item['pss:Part'])[0]['thumbnail']);
                item['thumbnail'] = tbh
              } catch (e) {}

              //Comparamos los atributos para parcearlos a array_agg
              if (!Array.isArray(item['pss:Attrib'])) {
                let v_atributos = item['pss:Attrib']
                item['pss:Attrib'] = []
                item['pss:Attrib'].push(v_atributos)
              }
            })

            resolve(resultado)
          } catch (e) {
            console.log(e);
            resolve()
          }
        } else {
          reject(error)
        }
      } else {
        reject(error)
      }


    })
  })
}
