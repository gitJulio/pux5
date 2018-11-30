const pg = require('../../configuration/ps_connection');
const TecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const VehicleParse = require('../vehiculos/parserVehiculos');

exports.getProductosByAtributos = async function(req, res, next) {
  let tec = await TecDoc.getArticlesAtributos(req.body.n_pagina, req.body.id_grupo).catch(err => {})

  if (tec != null) {

    var ar_oem = []
    //**************************************************************
    //  Obtenemos todos los OEM del resultado de TecDoc
    //**************************************************************
    for (var i = 0; i < tec.length; i++) {
      for (var j = 0; j < tec[i]["oemNumbers"].length; j++) {
        ar_oem = ar_oem.concat(tec[i]["oemNumbers"][j]["articleNumber"])
      }
    }
    // res.send(ar_oem)
    //**************************************************************
    //   Parseamos la inforcion de tecdoc con la base de datos
    //**************************************************************
    let item = await pg.func('api_catalogo.ft_proc_convierte_articulos_from_tecdoc',
      [0, req.body.id_region, JSON.stringify(tec)]).catch((err) => {})

    //**************************************************************
    //  Obtenemos los productos de Allas con los oem de tecdoc
    //**************************************************************
    var produ_allas = []
    // for (var i = 0; i < ar_oem.length; i++) {
    // console.log(ar_oem.toString());

    ar_oem.push(
      '7812'
    )

    articulos_allas = await pg.func('api_catalogo.ft_proc_get_productos_allas_v2_oem',
           [ar_oem, req.body.id_region]).catch((err) => {})

    // res.send(articulos_allas)
    produ_allas = produ_allas.concat(articulos_allas[0]["ft_proc_get_productos_allas_v2_oem"])


    // }
    // res.send(produ_allas)
    //**************************************************************
    //  Concatenamos el resuldado de allas y tecdoc
    //**************************************************************
    var json_final = []
    let mijson = []
    for (var i = 0; i < produ_allas.length; i++) {
      if (produ_allas[i] != null) {
        mijson = mijson.concat(produ_allas[i])
      }
    }
    mijson = mijson.concat(item[0]['ft_proc_convierte_articulos_from_tecdoc'])
    //***************************************************************************
    // Separamos el parametro de busqueda y aplicamos un filtro sobre la dada
    //***************************************************************************
    let p_busqueda = req.body.text_busqueda.split(" ");
    let dda = mijson.filter(ee => ee.atributos.some(aa1 => p_busqueda.includes(aa1.valor.toString())))


    res.send(dda)
  } else {
    let errd = [{
      "status": 200,
      "mensaje": "No se pudo encontrar el articulo solicitado"
    }]
    res.send(errd)
  }
  //@Carlos
}
