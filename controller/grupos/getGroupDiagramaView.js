const pg = require('../../configuration/ps_connection');
const tecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedores_config = require('../Proveedores/proveedores-config');
const parts_catalog = require('../Proveedores/Part-Catalog/Parts-Catalog-controller');
const vehiculosParse = require('../vehiculos/parserVehiculos')
const request = require('request');
const GruposParser = require('./parserGrupos')

exports.getGroupDiagramaView = async function(req, res, next) {

  let obtenerGruposPartC = [];
  let rempleazarMerge = [];
  let obtenerGupospartHijos = [];
  let mergeGruposAllasH = [];
  let vehiculoPartcatalog = await vehiculosParse.PARTCATALOG(req.body.vehiculos, 'id_and_marca')

  /********************Si el grupo no existe ************************/
  if (!req.body.id_grupo) {

    let idgrupo = 0;
    let id_parts = req.body.vehiculos.id_vehiculo;



    //***********************************************************//
    //------------Obtenemos diagrama de partc--------------------//
    var partc =
      await parts_catalog.getGroupDiagramaView(vehiculoPartcatalog, idgrupo).catch(err => {
        res.send(err)
      });
    //********************************************************************//
    //--------------Recoremos los resultados de Partc para----------------//
    //-----------Agregarlos a la variable obtenerGruposPartC--------------//
    await JSON.parse(partc).forEach((item) => {
      let itera = {
        "id_grupo": item.id,
        "name": item.name,
        "tiene_partes": item.hasParts,
        "name": item.name,
        "img": item.img,
        "id_proveedor": Proveedores_config.PROVEEDORES.PARTSCATALOG
      }
      obtenerGruposPartC.push(itera)
    });

    obtenerGruposPartC = JSON.stringify(obtenerGruposPartC);

    //**********************************************************//
    //-------------Obtenemos los grupos de Allas----------------//

    var grupoAllas =
      await pg.func(`api_catalogo.ft_proc_relacionar_grupos_diagramav2`,
        [obtenerGruposPartC]).catch(err => {
        res.send(err)
      })

    grupoAllas = grupoAllas[0]["ft_proc_relacionar_grupos_diagramav2"];
    grupoAllas.forEach(item => {
      let itera2 = {
        "id_grupo": item.id_grupo,
        "descripcion": item.nombre,
        "tiene_partes": item.tiene_partes,
        "tiene_hijos": item.tiene_hijos,
        "img": item.url_imagen,
        "id_proveedor": Proveedores_config.PROVEEDORES.PARTSCATALOG
      }
      rempleazarMerge.push(itera2)
    })

    res.send(rempleazarMerge)

  } else {

    /*******************************Si el grupo existe********************/


    //***************************************************************************
    //************************Identificacion de los grupos************************
    //***************************************************************************

    let gruposApi =
      await pg.func('api_catalogo.ft_proc_obtiene_grupo_api', [req.body.id_grupo]).catch(err => {
        res.status(500).send({
          error: err,
          status: 500
        })
      })


    if (res.statusCode != 200) {
      return
    }

    let id_grupo = await GruposParser.PARTCATALOG(gruposApi, 'id_source')

    //********************************************************************//
    //--------------Hacemos la consulta a PartCatalog---------------------//
    //--------------------------------------------------------------------//

    var partc =
      await parts_catalog.getGroupDiagramaView(vehiculoPartcatalog, id_grupo).catch(err => {
        res.send(err)
      });

    //************************************************************************//
    //Recorremos los resultados partc y los guardamos en obtenerGupospartHijos-//
    await JSON.parse(partc).forEach((item) => {
      let itera = {
        "id_grupo": item.id,
        "tiene_partes": item.hasParts,
        "descrpcion": item.name,
        "img": item.img,
        "id_proveedor": Proveedores_config.PROVEEDORES.PARTSCATALOG
      }
      obtenerGupospartHijos.push(itera)
    });

    obtenerGupospartHijos = JSON.stringify(obtenerGupospartHijos);

    //******************************************************************//
    //--------------------Obenemos los grupos de Allas------------------//
    //******************************************************************//
    var grupoAllas =
      await pg.func(`api_catalogo.ft_proc_relacionar_grupos_diagramav2`,
        [obtenerGupospartHijos]).catch(err => {
        res.send(err)
      })

    //******************************************************************//
    //--------Guardamos los resultados obtenidos de gruposAllas en-----//
    //--------------------la variable mergeGruposAllasH----------------//
    grupoAllas = grupoAllas[0]["ft_proc_relacionar_grupos_diagramav2"];
    grupoAllas.forEach(item => {
      let itera2 = {
        "id_grupo": item.id_grupo,
        "descripcion": item.nombre,
        "tiene_partes": item.tiene_partes,
        "tiene_hijos": item.tiene_hijos,
        "img": item.url_imagen,
        "id_proveedor": Proveedores_config.PROVEEDORES.PARTSCATALOG
      }
      mergeGruposAllasH.push(itera2)
    })

    res.send(mergeGruposAllasH);
  }
};