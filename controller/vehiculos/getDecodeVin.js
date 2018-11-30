const pg = require('../../configuration/ps_connection')
let request = require('request')
let parts_catalog = require(
  '../Proveedores/Part-Catalog/Parts-Catalog-controller')
let tecdoc = require('../Proveedores/TecDoc/TecDoc-controller')
let whi = require('../Proveedores/WHI/WHI-controller')
let Proveedores_config = require('../Proveedores/proveedores-config')

exports.getVin = async function(req, res, next) {
  if (req.params.vin.length < 17) {

    let vinMalo = {
      "respuesta": "Verifica que el VIN contenga los 17 caracteres",
      "status": 500
    }
    res.send(vinMalo)
    return
  }

  let vinData = req.params.vin.substr(0, 17)
  let id_marcabin = await pg.func('api_catalogo.ft_proc_devuelve_marca_from_vin', vinData)
  id_marcabin = id_marcabin[0]["ft_proc_devuelve_marca_from_vin"]

  //Declaramos variables para el formato del Json
  var datosvin = [];
  let id_vehiculo;
  let id_proveedor;
  let marca;
  //Si se envia un TRUE en el parametro se ejecutara la funcion de solicitud al proveedor PART-CATALOS
  let es_partCatalog

  if (req.params.es_part_catalog && req.params.es_part_catalog == 'true') {
    console.log('entros mal');
    //catch por si cae en error enviar el codigo del error
    var resulta = []
    var vin_pc = await parts_catalog.getDecodeVin(id_marcabin, vinData).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })
    if (res.statusCode != 200) {
      return
    }
    if (vin_pc == null) {
      re.send("bad");
    }
    res.send(vin_pc)
  } else {
    var vwhi = await whi.getVinDecode(vinData).catch(error => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })

    if (res.statusCode != 200) return

    try {
      let whivehiculo = vwhi["soapenv:Envelope"]["soapenv:Body"]["tns:VINDecodeResponse"]["tns:VehicleDetail"]["VehicleToEngineConfigId"];
      let whimarca = vwhi["soapenv:Envelope"]["soapenv:Body"]["tns:VINDecodeResponse"]["tns:VehicleDetail"]["pss:BaseVehicle"]["MakeName"];
      let basev = vwhi["soapenv:Envelope"]["soapenv:Body"]["tns:VINDecodeResponse"]["tns:VehicleDetail"]["pss:BaseVehicle"]["BaseVehicleId"];
      let engineb = vwhi["soapenv:Envelope"]["soapenv:Body"]["tns:VINDecodeResponse"]["tns:VehicleDetail"]["EngineConfigId"];

      datosvin.push({
        "id_vehiculo": whivehiculo,
        "id_proveedor": Proveedores_config.PROVEEDORES.WHI,
        "marca": whimarca,
        "engine_config_id": engineb,
        "base_vehicle": basev
      })
    } catch (e) {}
    //Si no se envia un TRUE en el parametro se ejecutara la solicitud al proveedor de TECDOC
    var vintec = await tecdoc.getVehiclesByVIN(vinData).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })
    if (res.statusCode != 200) {
      return
    }
    //entramos en el try para verificar que TECDOC nos devuelva toda la informacion requerida por el JSON ALLAS
    try {
      marca = vintec["matchingManufacturers"]["array"][0]["manuName"];
      id_vehiculo = vintec["matchingVehicles"]["array"][0]["carId"]
      id_proveedor = Proveedores_config.PROVEEDORES.TECDOC
      //Si tecdoc nos retorna toda la informacion que  necesita JSON ALLAS lo llenamos con los datos de tecdoc
      datosvin.push({
        id_vehiculo,
        id_proveedor,
        marca,
        "engine_config_id": null,
        "base_vehicle": null
      })
      let dba = await pg.func('api_catalogo.ft_view_vin_troncal', [vinData, id_marcabin])

      datosvin = datosvin.concat(dba[0]["ft_view_vin_troncal"])

    } catch (e) {} finally {
      //Si el JSON ALLAS se lleno nos retornara y mostrara la informacion del json ALLAS
      if (datosvin != "") { //Si la data del proveedor no viene vacia la retornamos

        res.send(datosvin)
      } else { //Si la data del proveedor viene vacia nos vamos a la funcion de la base de datos local con el toncal
        let dba = await pg.func('api_catalogo.ft_view_vin_troncal', [vinData, id_marcabin])

        datosvin = datosvin.concat(dba[0]["ft_view_vin_troncal"])
        let vacio = {
          "respuesta": "No se pudo decodificar el VIN, verifica que este escrito correctamente o utiliza el paso a paso",
          "status": 500
        }
        if (datosvin == "") {
          res.send(vacio)
        } else {
          res.send(datosvin);
        }
      }
    }
  }
}
