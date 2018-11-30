const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')
exports.getFiltros = async function pcg(id_marca, id_modelo_pcg, anio) {
  //Obtenemos los datos del proveedor
  let pcg = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG).catch(err => {
    res.status(500).send({
      error: err,
      status: 500
    });
  })
  // console.log("###########################");
  // console.log(parametros);
  // console.log("###########################");
  return new Promise((resolve, reject) => {
    //Header de coneccion al proveedor
    let headers = {
      'Content-Type': 'application/json',
      Authorization: pcg.password
    }
    // if (parametros == 0) {
    //   parametros = '';
    // }
    //Configuracion de  coneccion al proveedor
    let config_to_provider = {
      url: `https://api.parts-catalogs.com/v1/catalogs/${id_marca}/cars-parameters/?modelId=${id_modelo_pcg}&parameter=${anio},593b53050475a5ed532c28837afcace1`,
      method: 'GET',
      headers: headers,
      timeout: time.TIMEOUT.NIVEL2 //Limite de tiempo de respuesta del proveedor para saber si hay internet
    }
    // console.log(config_to_provider)
    //Comienza la coneccion
    request(config_to_provider, function(error, response, data) {
      //Si no hay error retorna la data
      if (!error) {
        if (response.statusCode == 200 && !error) {
          resolve(data)
        } else {

          reject(error)
        }
      } else {
        reject(error)
      }

    })
  })
}
