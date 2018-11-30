const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getVechiculoById = async function pcg(marca, id_vehiculo) {
  marca = marca.toLowerCase();
  //Obtenemos los datos del proveedor
  let pcg = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG)
  return new Promise((resolve, reject) => {
    //Header de coneccion al proveedor
    let headers = {
      'Content-Type': 'application/json',
      Authorization: pcg.password
    }
    //Configuracion de  coneccion al proveedor
    let config_to_provider = {
      url: `https://api.parts-catalogs.com/v1/catalogs/${marca}/cars2/${id_vehiculo}`,
      method: 'GET',
      headers: headers,
      timeout: time.TIMEOUT.NIVEL2
    }
    //Comienz la coneccion
    request(config_to_provider, function(error, response, data) {
      //Si no hay error retorna la data
      if (!error) {
        if (response.statusCode == 200) {
          resolve(data)
        } else {

          if (error.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
            resolve("")
          }
          reject(error)
        }
      } else {
        reject(err)
      }
    })
  })

}
