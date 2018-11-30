const pg = require('../../configuration/ps_connection');
const TecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const WHI = require('../Proveedores/WHI/WHI-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const config = require('../../configuration/config');
const VehicleParse = require('../vehiculos/parserVehiculos');
const parserCriterial = require('../filtros/parserCriterial');
const parserGrupos = require('../grupos/parserGrupos');

exports.getArticlesByCriterialFilter = async function(req, res, next) {

  //*************************Obtenemos los criterios****************************
  let criterial =
    await pg.func('api_catalogo.ft_proc_get_criterial_proveedores', [req.body.id_criterial, req.body.raw_value ]).catch((err) => {
      res.status(500).send({
        error: err,
        status: 500
    })
  })

  if (res.statusCode != 200) return;

  criterial = criterial[0]['ft_proc_get_criterial_proveedores']

  let criterialAllas = await parserCriterial.ALLAS(criterial, 'id_and_rawvalue');
  let criterialTecDoc = await parserCriterial.TECDOC(criterial, 'id_and_rawvalue');;
  let criterialWHI = await parserCriterial.WHI(criterial, 'id_and_rawvalue');

  //*********************Obtenemos los grupos de proveedores********************
  let gruposApi =
    await pg.func('api_catalogo.ft_proc_obtiene_grupo_api', req.body.id_grupo).catch(err => {
      res.status(500).send({
        error: err,
        status: 500
    })
  })

  if (res.statusCode != 200) return;

  let idGrupoAllas = await parserGrupos.ALLAS(gruposApi, 'id')
  let idGrupoTecDoc = await parserGrupos.TECDOC(gruposApi, 'id')
  let idGrupoWHI = await parserGrupos.WHI(gruposApi, 'id_source')

  //**************************Obtenmos los vehiculos****************************
  let vehiculoAllas =
    await VehicleParse.ALLAS(req.body.vehiculos, 'id').catch((err) => {
  })

  let vehiculoTecDoc =
    await VehicleParse.TECDOC(req.body.vehiculos, 'id').catch((err) => {
  })

  let vehiculoWHI =
    await VehicleParse.WHI(req.body.vehiculos, 'Base_and_Engine').catch((err) => {
  })

  //****************************************************************************
  //**********************Consultas a proveedores*******************************
  //****************************************************************************
  let articulos_tecdoc;
  if (req.body.vehiculos == null) {
    articulos_tecdoc =
    await TecDoc.getArticlesByCriterialFilter(idGrupoTecDoc, null,
      criterialTecDoc.id_criterial, criterialTecDoc.raw_value,
      req.body.id_page).catch((err) => {
      })
  }else if (vehiculoTecDoc) {
    articulos_tecdoc =
    await TecDoc.getArticlesByCriterialFilter(idGrupoTecDoc, vehiculoTecDoc,
      criterialTecDoc.id_criterial, criterialTecDoc.raw_value,
      req.body.id_page).catch((err) => {
      })
  }


  let articulos_allas;
  let articulos_WHI;

  if (req.body.id_page == 1) {
      //***************************Productos allas******************************
      if (req.body.vehiculos == null) {
        articulos_allas =
        await pg.func('api_catalogo.ft_pro_devuelve_articulos_by_criterial_filter',
        [idGrupoAllas, req.body.id_region, criterialAllas.id_criterial, criterialAllas.raw_value, null]).catch((err) => {
          console.log(err);
        })
      }else if (vehiculoAllas) {
        articulos_allas =
        await pg.func('api_catalogo.ft_pro_devuelve_articulos_by_criterial_filter',
        [idGrupoAllas, req.body.id_region, criterialAllas.id_criterial, criterialAllas.raw_value, vehiculoAllas]).catch((err) => {
          console.log(err);
        })
      }

    //****************************Productos WHI*******************************
    if (vehiculoWHI) {
      articulos_WHI =
      await WHI.ApplicationSearchByFilter(idGrupoWHI, vehiculoWHI, criterialWHI).catch((err) => {
        console.log(err);
      })
    }
  }

  try {
    articulos_allas = articulos_allas[0]['ft_pro_devuelve_articulos_by_criterial_filter']
  } catch (e) {}


    // ***************************************************************************
    // -----------------------------Merge de data --------------------------------
    // ***************************************************************************

    // Elimina articulos de tecdoc proveedores que existen en allas
    try {
      if (articulos_tecdoc) {
        let i = 0
        await articulos_tecdoc.forEach(item => {
          if (articulos_allas.filter(item_allas =>
              item_allas['id_articulo_api'] == item.genericArticles[0]['legacyArticleId']).length > 0) {
            delete articulos_tecdoc[i]
          }
          i++
        })
      }
    } catch (e) {}

    //Elimina articulos de whi existentes en allas
    try {
      if (articulos_WHI) {
        let i = 0
        await articulos_WHI.forEach(item=>{
          if (articulos_allas[0].filter(item_allas =>
              item_allas['id_articulo_api'] == item['pss:Part'] &&
              item_allas['id_marca_api'] == item['pss:MfrCode']
            ).length > 0) {
            delete articulos_WHI[i]
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
        [req.body.id_grupo, req.body.id_region, JSON.stringify(articulos_tecdoc), idGrupoTecDoc]).catch((err) => {
          console.log(err);
    })

    let dataWHI =
      await pg.func('api_catalogo.ft_proc_convierte_articulos_from_whi',
        [req.body.id_grupo, req.body.id_region, JSON.stringify(articulos_WHI)]).catch((err) => {
          console.log(err);
    })

    // ***************************************************************************
    // --------------------Merge de la Informacion Result-------------------------
    // ***************************************************************************
    let mijson = []
    try {
      if (articulos_allas) {
        mijson = await mijson.concat(articulos_allas)
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
