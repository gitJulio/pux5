const pg = require('../../configuration/ps_connection');
const TecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const WHI = require('../Proveedores/WHI/WHI-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const VehicleParse = require('../vehiculos/parserVehiculos');
const GruposParser = require('../grupos/parserGrupos');

exports.getProductoByGrupo = async function(req, res, next) {
  // ***************************************************************************
  // ----------------obtenemos los grupos por proveedor-------------------------
  // ***************************************************************************
  let gruposApi =
    await pg.func('api_catalogo.ft_proc_obtiene_grupo_api', req.body.id_grupo).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
    })
  })

  if (res.statusCode != 200) return;
  // ***************************************************************************
  // --------------------obtenemos la data de los grupos------------------------
  // ***************************************************************************
  let idGrupoAllas = await GruposParser.ALLAS(gruposApi, 'id')
  let idGrupoTecDoc = await GruposParser.TECDOC(gruposApi, 'id')
  let idGrupoWHI = await GruposParser.WHI(gruposApi, 'id_source')


  // ***************************************************************************
  // --------------------obtenemos la data de los vehiculos---------------------
  // ***************************************************************************
  let es_grupal = false;
  let vehiculoAllas;
  let vehiculoTecDoc;
  let vehiculoWHI;

  if (req.body.vehiculos) {
    if (req.body.vehiculos.length == 0) {
      es_grupal = true;
    }else {
      vehiculoAllas = await VehicleParse.ALLAS(req.body.vehiculos, 'id')
      vehiculoTecDoc = await VehicleParse.TECDOC(req.body.vehiculos, 'id')
      vehiculoWHI = await VehicleParse.WHI(req.body.vehiculos, 'Base_and_Engine')
    }
  }else {
    es_grupal = true;
  }


  // ***************************************************************************
  // --------------------Obtenemos de data desde proveedores--------------------
  // ***************************************************************************
  let articulosAllas;
  let articulosTecDoc;
  let articulosWHI;

  if (req.body.id_page == 1) {
    articulosAllas =
      await pg.func('api_catalogo.ft_proc_get_productos_allas',
        [req.body.id_grupo, req.body.id_region, vehiculoAllas, es_grupal]).catch((err) => {
        })

    articulosTecDoc =
      await TecDoc.getArticles(idGrupoTecDoc, vehiculoTecDoc, req.body.id_page, es_grupal).catch((err) => {})

    articulosWHI =
      await WHI.ApplicationSearch(idGrupoWHI, vehiculoWHI).catch((err) => {})
  }else {
    articulosTecDoc =
      await TecDoc.getArticles(idGrupoTecDoc, vehiculoTecDoc, req.body.id_page, es_grupal).catch((err) => {})
  }

  // ***************************************************************************
  // -----------------------------Merge de data --------------------------------
  // ***************************************************************************
  try {
    articulosAllas = articulosAllas[0]['ft_proc_get_productos_allas']
  } catch (e) {}

  // Elimina articulos de tecdoc proveedores que existen en allas
  try {
    if (articulosTecDoc) {
      let i = 0
      await articulosTecDoc.forEach(item => {
        if (articulosAllas.filter(item_allas =>
            item_allas['id_articulo_api'] == item.genericArticles[0]['legacyArticleId']).length > 0) {
          delete articulosTecDoc[i]
        }
        i++
      })
    }
  } catch (e) {}

  //Elimina articulos de whi existentes en allas
  try {
    if (articulosWHI) {
      let i = 0
      await articulosWHI.forEach(item=>{
        if (articulosAllas[0].filter(item_allas =>
            item_allas['id_articulo_api'] == item['pss:Part'] &&
            item_allas['id_marca_api'] == item['pss:MfrCode']
          ).length > 0) {
          delete articulosWHI[i]
        }
        i++
      })
    }
  } catch (e) {}

  //****************************************************************************
  //----------------------------Parseo de Informacion---------------------------
  //****************************************************************************
  let dataTecDoc =
    await pg.func('api_catalogo.ft_proc_convierte_articulos_from_tecdoc',
      [req.body.id_grupo, req.body.id_region, JSON.stringify(articulosTecDoc), idGrupoTecDoc]).catch((err) => {
        console.log(err);
  })

  let dataWHI =
    await pg.func('api_catalogo.ft_proc_convierte_articulos_from_whi',
      [req.body.id_grupo, req.body.id_region, JSON.stringify(articulosWHI)]).catch((err) => {
        console.log(err);
  })

  // ***************************************************************************
  // --------------------Merge de la Informacion Result-------------------------
  // ***************************************************************************
  let mijson = []
  try {
    if (articulosAllas) {
      mijson = await mijson.concat(articulosAllas)
    }
  } catch (e) {}

  try {
    if (dataTecDoc[0]['ft_proc_convierte_articulos_from_tecdoc']) {
      mijson = await mijson.concat(dataTecDoc[0]['ft_proc_convierte_articulos_from_tecdoc'])
    }
  } catch (e) {}

  try {
    if (dataWHI[0]['ft_proc_convierte_articulos_from_whi']) {
      mijson = await mijson.concat(dataWHI[0]['ft_proc_convierte_articulos_from_whi'])
    }
  } catch (e) {}

  if (mijson.length > 0) {
    res.send(mijson)
  }
  else {
    res.status(204).send();

  }
}
