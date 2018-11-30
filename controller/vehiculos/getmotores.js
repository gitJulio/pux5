const pg = require('../../configuration/ps_connection')
let request = require('request')
let parts_catalog = require('../Proveedores/Part-Catalog/Parts-Catalog-controller')
var colors = require('colors');
exports.getMotores = async function(req, res, next) {

  //Ejecutamos la funcion de Query a la DB para obtener ls motores locales en ALLA
  let gm = await pg.func('api_catalogo.ft_view_select_vehiculos_motor', [req.params.id_modelo, req.params.id_modelo_anio]).catch(err => {
    res.status(500).send({
      error: err,
      status: 500
    });
  })

  if (res.statusCode != 200) {
    return
  }
  res.send(gm)
}



//Funcion de obtener los motores desde PARTSCATALOG
exports.getMotoresPcg = async function(req, res, next) {

  let pcm = await parts_catalog.getMotores(req.params.id_marca, req.params.id_modelo_pcg, req.params.anio, req.params.pagina, req.params.parametros).catch(err => {

    res.status(500).send({
      error: err,
      status: 500
    });
  })


  if (res.statusCode != 200) {
    return
  }
  let autosP = pcm //Parseo a Joson el resultado
  let motor, anio, tipo_transmision, tipo_carroceria, region //Variables
  let v_motores = []
  let regionesD = []
  let trasmisionesD = []
  let motoresD = []
  let velocidadesD = []
  var filtros = []

  autosP.forEach(v => { //Recorremos autosP
    let motoresT = { //Objeto para comparacion IN
      common_engine_cc: "common_engine_cc",
      filter_engine: "filter_engine",
      specEngineCc: "specEngineCc",
      engine_capacity: "engine_capacity"
    }
    // res.send(v["parameters"])
    // console.log(v["parameter"]);
    try {
      anio = v["parameters"].filter(it => (it.key == "year"))[0]["value"] //Extraemos el año
    } catch (e) {}

    try {
      posicion = v["parameters"].filter(it => (it.key == "steering"))[0]["value"] //Estraemos Posicion
    } catch (e) {}
    try {
      motor = v["parameters"].filter(it => (it.key in motoresT))[0]["value"] //Extraemos motor
    } catch (e) {}
    try {
      tipo_transmision = v["parameters"].filter(it => (it.key == "transmissionType"))[0]["value"] //Extraer trasmision
    } catch (e) {}
    try {
      region = v["parameters"].filter(it => (it.key == "region"))[0]["value"] //Extraemos la region
    } catch (e) {}

    // tipo_carroceria = v["parameters"].filter(it => (it.key == "body_type"))[0]["value"] // Extraemos la carroceria
    let contador_V = null

    try {
      contador_V = autosP[25]["count"]
    } catch (e) {}

    v_motores.push( //Llenamos el resultado final
      {
        "id_vehiculo": v.id,
        "name": v.name,
        "id_proveedor": 4,
        "descripcion": v.description,
        "motor": motor,
        "marca": req.params.id_marca,
        "anio": anio,
        "posicion": posicion,
        "tipo_transmision": tipo_transmision,
        "region": region,
        "v_count": contador_V
      }
    )
  })

  res.send(v_motores) //Resolvemos la data
}