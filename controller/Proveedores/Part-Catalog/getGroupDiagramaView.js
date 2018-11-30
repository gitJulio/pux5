const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')
let timeout = require('../../../configuration/timeout_niveles')
const time = require('../../../configuration/timeout_niveles')

exports.getGroupDiagramaView = async function(p_vehiculo, p_idgrupo) {


  let passCatalog = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG)
  let marca = p_vehiculo.marca;
  let id_vehiculo = p_vehiculo.id;
  let url;

  //Obtenemos el modelo y el id del vehiculo del json enviado por el cliente de PARTSCATALOG
  return new Promise((resolve, reject) => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: passCatalog.password
    };
    if (p_idgrupo == 0) {
      url = `https://api.parts-catalogs.com/v1/catalogs/${marca}/groups2/?carId=${id_vehiculo}`;
    } else {
      url = `https://api.parts-catalogs.com/v1/catalogs/${marca}/groups2/?carId=${id_vehiculo}&groupId=${p_idgrupo}`;

    }

    let config_to_provider = {
      url: url,
      method: 'GET',
      headers: headers,
      timeout: time.TIMEOUT.NIVEL1
    };

    request(config_to_provider, function(error, response, data) {
      if (!error) {
        if (response.statusCode == 200) {
          resolve(data);
        } else {
          reject(error);
        }
      } else {
        reject(error)
      }
    });
  });
}