const pg = require("../../../configuration/ps_connection");
const request = require("request");
const Proveedores_config = require("../proveedores-config");
const time = require('../../../configuration/timeout_niveles')

exports.getDecodeVin = async function(marca, vin) {

  // var vind = req.params.vin;
  //Enviamos el parametro a la DB para decodificar la marca del VIN y lo asignamos

  //Asignamos la instancia para obtener los datos del proveedor
  let pcg = await Proveedores_config.Proveedor(
    Proveedores_config.PROVEEDORES.PARTSCATALOG
  ).catch(err => {

  });

  return new Promise((resolve, reject) => {

    //Asignamos los headers para la conecion al proveedor
    let headers = {
      "Content-Type": "application/json",
      Authorization: pcg.password
    };
    //Establecemos la configuracion los parametros de configuracion al proveedor
    let config_to_provider = {
      url: `https://api.parts-catalogs.com/v1/car/info?q=${vin}`,
      method: "GET",
      headers: headers,
      timeout: time.TIMEOUT.NIVEL2 //Limite de tiempo de respuesta para saber si hay internet
    };
    //Establecemos la coneccion al proveedor para obtener los datos requeridos
    request(config_to_provider, function(error, httpResponse, body) {
      let datosvin = []
      // console.log(body.length)
      // console.log(body);
      // if (body.length <= 2) {
      //   resolve()
      // }
      //Si no hay ningun error al momento de ejecutarse la coneccion retorna la data
      if (!error) {
        if (httpResponse.statusCode == 200) {
          body = JSON.parse(body);
          if (body == null || body == "") {
            let malo = [{
              "status": 500,
              "mensaje": "No se pudo decodificar el VIN"
            }]
            resolve(malo)
          }

          let vin_code = body.map(item => {
            return {
              id_vehiculo: item["carId"],
              id_proveedor: Proveedores_config.PROVEEDORES.PARTSCATALOG,
              marca: item["brand"],
              base_vehicle: null,
              engine_id: null
            }
          })
          resolve(vin_code)
          // try {
          //   marca = vin_code[0]["marca"] //Obtenemos el valor de la marca
          // } catch (e) {}
          // try {
          //   id_vehiculo = vin_code[0]["id_vehiculo"] //Obtenemos el valor del id del vehiculo
          // } catch (e) {}
          // try {
          //   id_proveedor = vin_code[0]["id_proveedor"] //Obtenemos el valor del proveedor
          // } catch (e) {}
          //
          // datosvin.push({
          //   id_vehiculo,
          //   id_proveedor,
          //   marca,
          //   "engine_config_id": null,
          //   "base_vehicle": null
          // })
          //
          // resolve(datosvin);
        } else {
          if (httpResponse.statusCode != 200 || error.code == "ETIMEDOUT") {
            console.log("#Mal tiempo");
            let malo = [{
              "status": 500,
              "mensaje": "No se pudo decodificar el VIN verifica tu conexion a internet"
            }]
            resolve(malo)
          }
          reject(body);
        }
      } else {
        reject()
      }
    });
  });
};
