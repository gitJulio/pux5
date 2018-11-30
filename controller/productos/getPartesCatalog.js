const pg = require('../../configuration/ps_connection');
const Proveedores_config = require('../Proveedores/proveedores-config');
const parts_catalog = require('../Proveedores/Part-Catalog/Parts-Catalog-controller');
const request = require('request');
const vehiculosParse = require('../vehiculos/parserVehiculos');
const GruposParser = require('../grupos/parserGrupos');
const requestImageSize = require('request-image-size');

exports.getPartesCatalog = async function(req, res, next) {

  //****************************************************************************
  //------------------------Obtenemos el grupo de allas -----------------------
  //****************************************************************************
  let idGrupo = req.body.idgrupo
  let partesJson = [];
  let gruposApi =
    await pg.func('api_catalogo.ft_proc_obtiene_grupo_api', [idGrupo]).catch(err => {});

  var idGrupoApi = await GruposParser.PARTCATALOG(gruposApi, 'id')
  let vehiculoPartcatalog = await vehiculosParse.PARTCATALOG(req.body.vehiculo, 'id_and_marca')


  //****************************************************************************
  //--------------------Consultamos api partCatalog ----------------------------
  //****************************************************************************
  var partc =
    await parts_catalog.getPartesCatalog(vehiculoPartcatalog, idGrupoApi).catch(err => {
      res.status(500).send({
        menssage: "No response",
        status: 500
      });
    });
  if (res.statusCode != 200) {
    return
  }


  const options = {
    url: `https:${partc["img"]}`,
    headers: {
      'User-Agent': 'request-image-size'
    }
  };
  let imgS = []

  // requestImageSize(options).then(size => imgS = size).catch(err => console.error(err));
  imgS = await requestImageSize(options).catch(err => console.error(err));

  let miRespuesta = {
    imagen_diagrama: partc["img"],
    w: imgS["width"],
    h: imgS["height"],
    partes: [],
    posiciones: []
  }

  //****************************************************************************
  //------------------------- pasamos partc a un json---------------------------
  //****************************************************************************
  partc['partGroups'].map(item => item['parts'].map(part => {
    let seleccion = false;
    // if (req.body.textparte != null && req.body.textparte == item.name) {
    //   seleccion = true
    // }
    let parte = {
      "nombre": item.name,
      "id_parte": part["id"],
      "oem": part["number"],
      "posicion": part["positionNumber"],
      "es_seleccionado": seleccion
    };
    partesJson = partesJson.concat(parte);
  }));

  miRespuesta.partes = partesJson;

  //***************************************************************************
  //----------------Ordenamos las coordenadas con la posición-------------------
  //*****************************************************************************
  miRespuesta.posiciones =
    partc['positions'].map(item => {
      let result = {
        posicion: item.number,
        es_seleccionado: false,
        coordenadas: {
          "x": item['coordinates'][0],
          "y": item['coordinates'][1],
          "w": item['coordinates'][2] <= 10 ? item['coordinates'][2] + 5 : item['coordinates'][2] - 13,
          "h": imgS["height"] <= 1099 ? item['coordinates'][3] - 5 : item['coordinates'][3]
        }
      }
      return result
    })

  //*************  Finalmente imprimimos la respuesta **************************
  res.send(miRespuesta)
};
