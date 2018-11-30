const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
let timeout = require('../../../configuration/timeout_niveles')
const time = require('../../../configuration/timeout_niveles')
exports.getMarcas = async function pcg() {

  //Obtenemos los datos del proveedor
  let pcg = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG).catch(err => {

    // res.status(500).send({error:err,status:500});
  })
  return new Promise((resolve, reject) => {
    //Header de coneccion al proveedor
    let headers = {
      'Content-Type': 'application/json',
      Authorization: pcg.password
    }
    //Configuracion de  coneccion al proveedor
    let config_to_provider = {
      url: "https://api.parts-catalogs.com/v1/catalogs/",
      method: 'GET',
      headers: headers,
      timeout: time.TIMEOUT.NIVEL1 //Limite de tiempo de respuesta al proveedor para saber si hay internet
    }
    //Comienz la coneccion
    request(config_to_provider, function(error, response, data) {
      //Si no hay error retorna la data


      if (response.statusCode == 200 || !error) {
        if (data != null) {

          resolve(data)
        }
        // else {
        //   if (error.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion local de la db
        //
        //     let dba = pg.func('api_catalogo.ft_mantenimiento_allasBackup_marcas').catch(err => {
        //       reject(err)
        //     })
        //     resolve(dba)
        //   }
        // }
      } else {
        if (error.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion local de la db
          let vacio = [{
            "status": 500,
            "mensaje": "Parece que la conexion de internet esta lenta"
            }]
          resolve(dba)
        }
        reject(error)
      }

    })
  })

}
