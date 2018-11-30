const pg = require('../../configuration/ps_connection');
const TecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');
const VehicleParse = require('../vehiculos/parserVehiculos');
const GruposParser = require('../grupos/parserGrupos');
var _ = require('lodash');

exports.getProductosByAtributos = async function(req, res, next) {

  // ***************************************************************************
  // --------------------obtenemos la data de los grupos------------------------
  // ***************************************************************************
  let gruposApi =
    await pg.func('api_catalogo.ft_proc_obtiene_grupo_api', req.body.id_grupo).catch(err => {
  })

  let idGrupoAllas = await GruposParser.ALLAS(gruposApi, 'id_source')
  let idGrupoTecDoc = await GruposParser.TECDOC(gruposApi, 'id_source')
  let idGrupoWHI = await GruposParser.WHI(gruposApi, 'id_source')

  //*****************VARIABLES GLOBALES-------------------
  let p_busqueda = req.body.text_busqueda.split(" ")
  let resultadoCriterialRaw = []
  let miJsonFinal = []

  //****************************************************************************
  //---------------------------Peticiones a proveedores-------------------------
  //****************************************************************************
  let allasArticulos;
  if (req.body.id_page == 1) {
    allasArticulos =
    await pg.func('api_catalogo.ft_proc_busca_articulos_by_criterial', [req.body.id_grupo, req.body.id_region, p_busqueda]).catch(err => {
    })
  }

  try {
    allasArticulos = allasArticulos[0]["ft_proc_busca_articulos_by_criterial"]
  } catch (e) {}

  let tec =
    await TecDoc.getArticlesAtributos(idGrupoTecDoc).catch(err => {
  })

  //------OBTENEMOS LOS ARTICULOS DE TEC DOC QUE CUMPLEN CON LOS CRITERIOS------
  let criterialRawFinal = []
  let dataMap;

  try {
    dataMap = (tec["criteriaFacets"]["counts"].map(itt => itt.criteriaValueCounts.map(itt2 => {
      if (p_busqueda.includes(itt2.rawValue)) {
        criterialRawFinal = criterialRawFinal.concat({
          criterial: itt.criteria.criteriaId,
          raw_value: itt2.rawValue
        })
      }
    })));
  } catch (e) {}

  for (var i = 0; i < criterialRawFinal.length; i++) {
    let tec2 =
      await TecDoc.getArticlesAtributos2(criterialRawFinal[i]["criterial"], criterialRawFinal[i]["raw_value"], idGrupoTecDoc, req.body.id_page).catch(err => {
      })
      resultadoCriterialRaw = resultadoCriterialRaw.concat(tec2)
  }

  //Removemos los duplicados
  resultadoCriterialRaw = _.uniq(resultadoCriterialRaw)


  //******************************MERGE DE PRODUCTOS****************************
  try {
    if (resultadoCriterialRaw) {
      let i = 0
      await resultadoCriterialRaw.forEach(item => {
        if (allasArticulos.filter(item_allas =>
            item_allas['id_articulo_api'] == item.genericArticles[0]['legacyArticleId']).length > 0) {
          delete resultadoCriterialRaw[i]
        }
        i++
      })
    }
  } catch (e) {}

  //*************************************PARSEO*********************************
  let articulosTecDoc =
    await pg.func('api_catalogo.ft_proc_convierte_articulos_from_tecdoc', [0, req.body.id_region, JSON.stringify(resultadoCriterialRaw), idGrupoTecDoc]).catch((err) => {
  })

  //*****************************MERGE RESULTADO********************************
  try {
    if (allasArticulos != null && allasArticulos) {
      console.log('allasArticulos');
      miJsonFinal = miJsonFinal.concat(allasArticulos)
    }
  } catch (e) {}
  try {
    if (articulosTecDoc[0]["ft_proc_convierte_articulos_from_tecdoc"] != null) {
      miJsonFinal = miJsonFinal.concat(articulosTecDoc[0]["ft_proc_convierte_articulos_from_tecdoc"])
    }
  } catch (e) {}
  
  res.send(miJsonFinal)
}
