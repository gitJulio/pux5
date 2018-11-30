const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')
exports.getModelos = async function pcg(id_marca) {
  //Obtenemos los datos del proveedor
  let pcg = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG).catch(err => {
    res.status(500).send({
      error: err,
      status: 500
    });
  })
  return new Promise((resolve, reject) => {
    //Header de coneccion al proveedor
    let headers = {
      'Content-Type': 'application/json',
      Authorization: pcg.password
    }
    //Configuracion de  coneccion al proveedor
    let config_to_provider = {
      url: `https://api.parts-catalogs.com/v1/catalogs/${id_marca}/models/`,
      method: 'GET',
      headers: headers,
      timeout: time.TIMEOUT.NIVEL1 //Limite de tiempo de respuesta del proveedor para saber si hay internet
    }

    request(config_to_provider, function(error, response, data) {
      //Si no hay error retorna la data
      if (!error) {
        if (response.statusCode == 200 && !error) {
          resolve(data)
        } else {

          reject(error)
        }
      }else {
        reject(error)
      }

    })
  })
}
