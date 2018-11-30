const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getMotores = async function(id_marca, id_modelo_pcg, anio, pagina, parametros) {
  //Obtenemos los datos del proveedor

  if (parametros == '0' || parametros == 0) {
    parametros = '';
  }

  let pcg = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG).catch(err => {
    reject(err)
  })
  return new Promise((resolve, reject) => {
    //Header de datos al proveedor
    let headers = {
      'Content-Type': 'application/json',
      Authorization: pcg.password
    }
    //Configuracion de coneccion al proveedor
    let config_to_provider = {
      url: `https://api.parts-catalogs.com/v1/catalogs/${id_marca}/cars2/?modelId=${id_modelo_pcg}&parameter=${anio},593b53050475a5ed532c28837afcace1${parametros}&page=${pagina}`,
      method: 'GET',
      headers: headers,
      timeout: time.TIMEOUT.NIVEL2 //Limite de tiempo de respuesta del proveedor para saber si hay internet
    }
    // console.log("\n\n----------------------");
    console.log(config_to_provider["url"])
    // console.log("\n\n----------------------");
    //RUTAS FIJAS PARA ANGULAR AL MOMENTO DEL PASO A PASO DEL USUARIO ***DISEÑO ANGULAR
    request(config_to_provider, function(error, response, data) {
      //Si no hay error retorna la data
      // console.log(response[0]["x-total-count"])
      if (!error && response.statusCode == 200) {

        //Concatenar el response
        data = JSON.parse(data)
        // pcm["headers"]["x-total-count"]

        data.push({
          "count": response["headers"]["x-total-count"]
        })

        resolve(data);
      } else {
        if (error.code == 'ETIMEDOUT') { //Si no hay internet retornamos la funcion de la base de datos local
          let dba = pg.func('api_catalogo.ft_view_motores_by_Part_catalog', id_modelo_pcg)
          resolve(dba)
        }
        reject(error)
      }

    })
  })
}
