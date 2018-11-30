const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')

exports.getPartesCatalog = async function(p_vehiculo, p_idGrupo) {
  let passCatalog = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG)
  let marca = p_vehiculo["marca"];
  let id_vehiculo = p_vehiculo["id"];

  //Obtenemos el modelo y el id del vehiculo del json enviado por el cliente de PARTSCATALOG
  return new Promise((resolve, reject) => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: passCatalog.password
    };
    url = `https://api.parts-catalogs.com/v1/catalogs/${marca}/parts2/?carId=${id_vehiculo}&groupId=${p_idGrupo}`

    let config_to_provider = {
      url: url,
      method: 'GET',
      headers: headers
    };

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