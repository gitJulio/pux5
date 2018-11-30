const pg = require('../../configuration/ps_connection');
const tecDoc = require('../Proveedores/TecDoc/TecDoc-controller');
const Proveedores_config = require('../Proveedores/proveedores-config');
const request = require('request');
const vehiculosParse = require('../vehiculos/parserVehiculos');
const whi = require('../Proveedores/WHI/WHI-controller');
const GruposParser = require('./parserGrupos')


exports.getGroupRelacionados =  async function(req, res, next){
  //***************************************************************************
  //********************Identificacion del vehiculos***************************
  //***************************************************************************
  let vehiculoTecDoc = await vehiculosParse.TECDOC(req.body.vehiculos,'id')
  let vehiculoWhi = await vehiculosParse.WHI(req.body.vehiculos,'Base_and_Engine')
  let vehiculoAllas = await vehiculosParse.ALLAS(req.body.vehiculos,'id')

  //***************************************************************************
  //************************Identificacion de los grupos************************
  //***************************************************************************
  let gruposApi =
     await pg.func('api_catalogo.ft_proc_obtiene_grupo_api', [req.body.id_grupo]).catch(err=>{
       res.status(500).send({ error: err, status:500 })
  })

  if(res.statusCode!=200)  return

  let idGrupoALLAS = await GruposParser.ALLAS(gruposApi, 'id_source')
  let idGrupoTecDoc = await GruposParser.TECDOC(gruposApi, 'id_source')
  let idGrupoWHI = await GruposParser.WHI(gruposApi, 'id_source')

  //*********************************************************************//
  //**********************Consulta de data a proveedores************************
  //*********************************************************************//

  //-------------------------------------Allas----------------------------------

  let gruposAllas =
    await  pg.func('api_catalogo.ft_proc_obtener_grupos_relacionados',[idGrupoALLAS, req.body.id_region]).catch( err => {
  });
  //-------------------------------------TecDoc---------------------------------
  if (await vehiculosParse.TECDOC(req.body.vehiculos,'exist') &&
      await await GruposParser.TECDOC(gruposApi, 'exist')) {
    var gruposTecDoc =
      await tecDoc.getChildNodesAllLinkingTarget2(vehiculoTecDoc, idGrupoTecDoc).catch(err=>{
    })
  }

  //-----------------------------------------whi--------------------------------
  if (await vehiculosParse.WHI(req.body.vehiculos,'exist') &&
      await await GruposParser.WHI(gruposApi, 'exist')) {
    var gruposWHI =
      await whi.getRelacionados(vehiculoWhi, idGrupoWHI).catch(err=>{
    });
  }

  //***********************Distinct grupos de proveedores***********************
  let gruposProveedores = []
  let gruposProveedorAllas = []

  //---------------------------------Tecdoc-------------------------------------
  try{
    await gruposTecDoc.forEach((item)=> {
      let itera={
        "id_grupo":item.assemblyGroupNodeId,
        "id_proveedor":Proveedores_config.PROVEEDORES.TECDOC
      }
      gruposProveedores.push(itera)
     });
  }catch(e){}

  //-----------------------------------WHI-------------------------------------
 try {
    await gruposWHI.forEach((item)=> {
      let itera={
                "id_grupo":item.Id,
                "id_proveedor":Proveedores_config.PROVEEDORES.WHI
      }
    gruposProveedores.push(itera)
    });
  }catch (e) {}

  await gruposAllas.forEach((item)=> {
     let itera={
       "id_grupo":item.id_grupo
     }
     gruposProveedorAllas.push(itera);
  });

  //**************************************Merge Data****************************
  let strGruposProveedores = JSON.stringify(gruposProveedores);
  let strGruposProveedoresAllas = JSON.stringify(gruposProveedorAllas);

  let resultado =
  await pg.func(`api_catalogo.ft_proc_igualar_grupo_allas`,[strGruposProveedores, req.body.id_region, strGruposProveedoresAllas]).catch( err => {
    return err
  });

  res.send(resultado)
}
