const pg = require('../../configuration/ps_connection')
const request = require('request')
let tecdoc = require('../Proveedores/TecDoc/TecDoc-controller')
const parts_catalog = require('../Proveedores/Part-Catalog/getVehiculoById')
const Proveedores_config = require('../Proveedores/proveedores-config')
let whi = require('../Proveedores/WHI/WHI-controller')

exports.getVehiculoIdP = async function(req, res, next) {
  var jsonById = []
  //Obtenemos el proveeedor para ejecutar la funcion correspondiente segun el proveedor enviado y obtenido por la peticion
  var bodyy = [];
  var resultadoPCG = [];
  bodyy = req.body;
  // console.log(bodyy)
  if (req.body.length >= 2) {

    // bodyy.forEach(async item => {
    //   console.log(item.id_proveedor);
    for (var i = 0; i < bodyy.length; i++) {


      if (bodyy[i]["id_proveedor"] == Proveedores_config.PROVEEDORES.PARTSCATALOG) {
        // console.log("aaa");

        let autPc = await parts_catalog.getVechiculoById(bodyy[i]["marca"], bodyy[i]["id_vehiculo"]).catch(err => {
          res.status(500).send({
            error: err,
            status: 500
          });
        })
        // res.send(autPc)
        //Nos retorna so existe un error
        if (res.statusCode != 200) {
          return
        }
        //Formateamos el string que obtenemos a JSON para la insercion
        autPc = JSON.parse(autPc)
        //LLenamos el json con los datos que le requerimos al proveedor para  mostrarlos en la api
        // let motor = null;
        try {

          try {
            let motoresT = { //Objeto para comparacion IN
              common_engine_cc: "common_engine_cc",
              filter_engine: "filter_engine",
              specEngineCc: "specEngineCc",
              engine_capacity: "engine_capacity"
            }
            // motor = autPc["parameters"].filter(it => (it.key == "common_engine_cc" || it.key == "filter_engine" || it.key == "specEngineCc" || it.key == "engine_capacity"))[0]["value"]
            motor = autPc["parameters"].filter(it => (it.key in motoresT))[0]["value"]
          } catch (e) {}
          let anio = autPc["parameters"].filter(it => (it.key == "year"))[0]["value"]
          let trasmision = autPc["parameters"].filter(it => (it.key == "transmissionType"))[0]["value"]
          let region = autPc["parameters"].filter(it => (it.key == "region"))[0]["value"]
          jsonById.push({ //Push para insertar los datos del vehiculo
            "id_vehiculo": autPc["id"],
            "id_proveedor": Proveedores_config.PROVEEDORES.PARTSCATALOG,
            "anio": anio,
            "motor": motor,
            "modelo": autPc["name"],
            "marca": bodyy[i]["marca"],
            "transmision": trasmision,
            "region": region
          })

        } catch (e) {
          let nada = [{
            "status": 200,
            "mensaje": "El auto que intenta buscar no existe"
          }]
          res.send(nada) //Si no se recupero data retornamos esta data
          // console.log("####");
        }
        // finally {
        resultadoPCG = resultadoPCG.concat(jsonById)
        //
        // if (resultadoPCG.length >= 1) {
        //   resultadoPCG.forEach(id => {
        //     if (!id.id_vehiculo) {
        //       console.log("cAYO");
        //       resultadoPCG = resultadoPCG.concat(jsonById)
        //     } else {
        //       console.log("####################");
        //       console.log(id.id_vehiculo);
        //       console.log(jsonById.id_vehiculo);
        //       console.log("####################");
        //       console.log(jsonById);
        //       if (id.id_vehiculo != jsonById["id_vehiculo"]) {
        //         resultadoPCG = resultadoPCG.concat(jsonById)
        //       }
        //     }
        //   })
        // } else {
        //   resultadoPCG = resultadoPCG.concat(jsonById)
        // }


        //Si no existe error  retornamos la data
        // res.send(resultadoPCG)
        //Retornamos y mostramos los datos en la api
        //Si el proveedor enviado por el vendedor es de TECDOC ejecutara lo siguiente
      }
    }
    // console.log(resultadoPCG);
    // console.log(jsonById)
    res.send(jsonById);
    // return
  }


  if (req.body.id_proveedor == Proveedores_config.PROVEEDORES.PARTSCATALOG) {
    console.log("hfdh");

    let autPc = await parts_catalog.getVechiculoById(req.body.marca, req.body.id_vehiculo).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })
    // res.send(autPc)
    // res.send(autPc)
    //Nos retorna so existe un error
    if (res.statusCode != 200) {
      return
    }
    //Formateamos el string que obtenemos a JSON para la insercion
    autPc = JSON.parse(autPc)
    //LLenamos el json con los datos que le requerimos al proveedor para  mostrarlos en la api
    // let motor = null;
    try {

      try {
        let motoresT = { //Objeto para comparacion IN
          common_engine_cc: "common_engine_cc",
          filter_engine: "filter_engine",
          specEngineCc: "specEngineCc",
          engine_capacity: "engine_capacity"
        }
        // motor = autPc["parameters"].filter(it => (it.key == "common_engine_cc" || it.key == "filter_engine" || it.key == "specEngineCc" || it.key == "engine_capacity"))[0]["value"]
        motor = autPc["parameters"].filter(it => (it.key in motoresT))[0]["value"]
      } catch (e) {}
      let anio = autPc["parameters"].filter(it => (it.key == "year"))[0]["value"]
      let trasmision = autPc["parameters"].filter(it => (it.key == "transmissionType"))[0]["value"]
      let region = autPc["parameters"].filter(it => (it.key == "region"))[0]["value"]

      jsonById.push({ //Push para insertar los datos del vehiculo
        "id_vehiculo": autPc["id"],
        "id_proveedor": Proveedores_config.PROVEEDORES.PARTSCATALOG,
        "anio": anio,
        "motor": motor,
        "modelo": autPc["name"],
        "marca": req.body.marca,
        "transmision": trasmision,
        "region": region
      })

    } catch (e) {
      let nada = [{
        "status": 200,
        "mensaje": "El auto que intenta buscar no existe"
      }]
      res.send(nada) //Si no se recupero data retornamos esta data
      // console.log("####");
    }
    // finally {
    res.send(jsonById) //Si no existe error  retornamos la data

    //Retornamos y mostramos los datos en la api
    //Si el proveedor enviado por el vendedor es de TECDOC ejecutara lo siguiente
  } else if (req.body.id_proveedor == Proveedores_config.PROVEEDORES.TECDOC) {
    //Hacemos referencia a la funcion de TECDOC para lo solicitado
    let autTd = await tecdoc.getVehicleByIds3(req.body.id_vehiculo).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })

    //Nos retorna si existe un error
    if (res.statusCode != 200) {
      return
    }
    //Declaramos una funcion para poders hacerle un subtring para extraer al año que necesitamos mostrar
    let anioo = autTd["array"][0]["vehicleDetails"]["modelName"];
    //Realizamos el subtring del año
    var anioc = anioo.substring(0, 4);
    //Realizamos el Push para llenar el Json de ALLAS con los datos requeridos y obtenidos por el proveedor
    try {
      jsonById.push({ //Push para los datos del formato requerido
        "id_vehiculo": autTd["array"][0]["vehicleDetails"]["carId"],
        "id_proveedor": Proveedores_config.PROVEEDORES.TECDOC,
        "anio": anioc,
        "motor": autTd["array"][0]["vehicleDetails"]["typeName"],
        "modelo": autTd["array"][0]["vehicleDetails"]["modelName"],
        "marca": autTd["array"][0]["vehicleDetails"]["manuName"]
      })
    } catch (e) {
      let nada = [{
        "status": 200,
        "mensaje": "El auto que intentas buscar no existe"
      }]

      res.send(nada)

    } finally {
      res.send(jsonById)
    }
  } else if (req.body.id_proveedor == Proveedores_config.PROVEEDORES.ALLAS) {
    let vehiculoAllas = await pg.func('api_catalogo.ft_proc_devuelve_vehiculo_allas_by_id', req.body.id_vehiculo).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })
    //Nos retorna si existe un error
    if (res.statusCode != 200) return
    res.send(vehiculoAllas)
  } else if (req.body.id_proveedor == Proveedores_config.PROVEEDORES.WHI) {

    console.log("#########");


    let whiV = await whi.VehicleIdSearch(req.body.base_vehicle, req.body.engineID).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
      });
    })
    if (res.statusCode != 200) return

    let whiData = whiV["soapenv:Envelope"]["soapenv:Body"]["tns:VehicleIdSearchResponse"]["tns:VehicleDetail"]
    let yyyy = whiData["pss:BaseVehicle"]["Year"]
    let model = whiData["pss:BaseVehicle"]["ModelName"]
    let engine
    let manu
    whiData["pss:Attrib"].forEach(i => {
      if (i["Name"] == "ENGINE_BASE") {
        engine = i["text"]
      }
      if (i["Name"] == "ENGINE_MFR") {
        manu = i["text"]
      }
    })
    let id_v = whiData["VehicleToEngineConfigId"]
    id_v = id_v
    yyyy = yyyy.toString()

    jsonById.push({ //Push para los datos del formato requerido
      "id_vehiculo": id_v,
      "id_proveedor": Proveedores_config.PROVEEDORES.WHI,
      "anio": yyyy,
      "motor": engine,
      "modelo": model,
      "marca": manu
    })

    res.send(jsonById)

  }
}
