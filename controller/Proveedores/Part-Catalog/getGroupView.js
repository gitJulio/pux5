const pg = require('../../../configuration/ps_connection')
let request = require('request')
let Proveedores_config = require('../proveedores-config')

exports.getGroupView = async function(req, res, next) {
  let pcg = await Proveedores_config.Proveedor(Proveedores_config.PROVEEDORES.PARTSCATALOG)
  let marca
  let id_vehiculo
  //Obtenemos el modelo y el id del vehiculo del json enviado por el cliente de PARTSCATALOG
  // if (req.body.vehiculo.filter(item => item.id_proveedor === Proveedores_config.PROVEEDORES.PARTSCATALOG)) {
  //     marca=req.body.vehiculo[0].marca
  //     id_vehiculo =  req.body.vehiculo.filter(item => item.id_proveedor == Proveedores_config.PROVEEDORES.PARTSCATALOG)[0]['id_vehiculo']
  // }
  return new Promise((resolve, reject) => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: pcg.password
    };
    let config_to_provider = {
      url: `https://api.parts-catalogs.com/v1/catalogs/`,
      method: 'GET',
      headers: headers
    };
    request(config_to_provider, function(error, response, data) {
      if (!error) {
        if (res.statusCode == 200) {
          resolve(data);
        } else {
          reject(error);
        }
      } else {
        reject(err)
      }
    });
  });
}