const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
const time = require('../../../configuration/timeout_niveles')

exports.getGrupos = async function(p_vehiculo, p_idGrupo) {

  let pcg = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG)

  return new Promise((resolve, reject) => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: pcg.password
    }

    let urlMain;

    urlMain = `https://api.parts-catalogs.com/v1/catalogs/${p_vehiculo.marca}/groups2/?carId=${p_vehiculo.id}&groupId=${p_idGrupo}`


    let config_to_provider = {
      url: urlMain,
      method: 'GET',
      headers: headers,
      timeout: time.TIMEOUT.NIVEL1
    }

    request(config_to_provider, function(error, response, data) {
      if (!error) {
        if (response.statusCode == 200) {
          resolve(JSON.parse(data));
        } else {
          reject(error);
        }
      } else {
        reject(err)
      }
    });
  });
}

//******************************************************************************
//------------------------------REFERENIAS--------------------------------------
//******************************************************************************
// api-catalogo\controller\grupos\getGrupos.js