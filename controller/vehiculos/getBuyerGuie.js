const pg = require('../../configuration/ps_connection')
const request = require('request')
const tecdoc = require('../Proveedores/TecDoc/TecDoc-controller')
const whi = require('../Proveedores/WHI/WHI-controller')

const Proveedores_config = require('../Proveedores/proveedores-config')

exports.getBuyerGuie = async function(req, res, next) {
  //**--------------------------------------------------------------
  //        GUIA DEL VENDEDOR PARA WHI
  //**--------------------------------------------------------------
  //SI en los parametros se envia un TRUE se ejevuta la funcion se solicitud al proveedor WHI

  if (req.body.id_proveedor == Proveedores_config.PROVEEDORES.WHI) {

    ////******************GUIA LOCAL

    let guial = await pg.func('api_catalogo.ft_json_guia_allas_backup', [req.body.id_articulo, req.body.id_proveedor])

    ////******************GUIA LOCAL
    if (guial[0]["ft_json_guia_allas_backup"] != null) {
      res.send(guial[0]["ft_json_guia_allas_backup"])

      ////******************GUIA LOCAL
    } else {

      try {
        var vwhi = await whi.BuyersGuideSearch(req.body.id_articulo, req.body.manuCode, req.body.partType, req.body.posgruId).catch(error => {
          res.status(500).send({
            error: err,
            status: 500
          });
        })
        if (res.statusCode != 200 && vwhi != null) {}

        var jsonMarcas = [],
          jsonModelos = [],
          whiGuia = []
        let conta = 0
        let dwhi = vwhi

        for (var i = 0; i < dwhi.length; i++) {

          jsonMarcas.push({
            "id_marca": i,
            "es_select": false,
            "n_marca": dwhi[i]["Name"]

          })
          for (var j = 0; j < dwhi[i]["pss:Model"].length; j++) {
            // console.log(dwhi[i]["pss:Model"][j]["pss:Engine"]);
            //dwhi[i]["pss:Model"][j]["pss:Engine"][0]["carid"] = null
            await jsonModelos.push({
              "id_marca": i,
              "n_marca": dwhi[i]["Name"],
              "modelos": {
                "nombreModelo": dwhi[i]["pss:Model"][j]["Name"],
                "es_select": false,
                "vehiculos": dwhi[i]["pss:Model"][j]["pss:Engine"]
              }
            })


          }
          if (dwhi[i]["pss:Model"]["Name"]) {

            await jsonModelos.push({
              "id_marca": i,
              "n_marca": dwhi[i]["Name"],
              "modelos": {

                "nombreModelo": dwhi[i]["pss:Model"]["Name"],
                "es_select": false,
                "vehiculos": dwhi[i]["pss:Model"]["pss:Engine"]
              }
            })
          }
        }

        var nn_marca
        var nn_modelos
        var jsonModelosMotores = []
        var nodo = []
        for (var i = 0; i < jsonMarcas.length; i++) {

          for (var j = 0; j < jsonModelos.length; j++) {

            if (jsonModelos[j]["id_marca"] == jsonMarcas[i]["id_marca"]) {

              nodo.push(
                jsonModelos[j]["modelos"]
              )
            }
          } //FinJ
          let vehiculosFinal = [{
            "marca": jsonMarcas[i]["n_marca"],
            "modelo": nodo
          }]

          jsonModelosMotores = jsonModelosMotores.concat(vehiculosFinal)
          // jsonModelosMotores.push(
          //   [{
          //     "marca": jsonMarcas[i]["n_marca"],
          //     "modelo": nodo
          //   }]
          // )
          nodo = []
        } //Fin i
        ////********************************************************************************************
        //  *   Eliminacion de campo PART_VEHICLE (CANTIDAD DE ESTA PIEZA QUE NECESITA CADA VEHICULO)  *
        ////********************************************************************************************

        //   //No mostrar los ParVehicles en ANGULAR eliminar ese fltro al momento de la visualizacion
        // for (var i = 0; i < jsonModelosMotores.length; i++) {
        //
        //   console.log(jsonModelosMotores[i][0]["marca"]);
        //   // console.log(jsonModelosMotores[i][0]["marca"]);
        //   // console.log(jsonModelosMotores[i][0]["modelo"].length);
        //   for (var jj = 0; jj < jsonModelosMotores[i][0]["modelo"].length; jj++) {
        //
        //     console.log(jsonModelosMotores[i][0]["modelo"][jj]["nombreModelo"]);
        //   }
        // }
      } catch (e) {}
      res.send(jsonModelosMotores)
    }
  } else if (req.body.id_proveedor == Proveedores_config.PROVEEDORES.TECDOC) {

    //**--------------------------------------------------------------
    //        GUIA DEL VENDEDOR PARA WHI
    //**--------------------------------------------------------------
    ////******************GUIA LOCAL
    let guia = await pg.func('api_catalogo.ft_json_guia_allas_backup', [req.body.id_articulo, req.body.id_proveedor])

    if (guia[0]["ft_json_guia_allas_backup"] != null) {

      res.send(guia[0]["ft_json_guia_allas_backup"])

      ////******************GUIA LOCAL

    } else {
      var tecdoc4 = await tecdoc.getArticleLinkedAllLinkingTarget4(req.body.id_articulo, req.body.id_vehiculo).catch(err => { //Capturamos los parametros enviados y ejecutamos la funcion y petidcion al proveedor
        res.status(500).send({
          error: err,
          status: 500
        });
      })
      if (res.statusCode != 200) {
        return
      }


      if (!tecdoc4["array"][0]["articleLinkages"]["array"]) {
        let vacio = [{
          "status": 200,
          "mensaje": "No se pudo obtener la guia del vendedor"
        }]
        res.send(vacio)

      } else {

        //Esta es la ultima funcion que utiliza la data resuelta por la ultima funcion de este archivo al final (ABAJO)
        let carids = await carId(tecdoc4, req.body.id_articulo).catch(err => {}); //Asignamos una variable para enviarla a la siguiente funcion con los datos que requiere
        let tecdoc3 = await tecdoc.getVehicleByIds3(carids).catch(err => { //Capturamos la variable carids y se la enviamos a la funcion
          res.status(500).send({
            error: err,
            status: 500
          });
        })
        if (res.statusCode != 200) {
          return
        }
        let vei = tecdoc3['array'].map(i => i["vehicleDetails"]) //Llenamos con todos los array de los vehiculos obtenidos
        let idManus = tecdoc3['array'].map(i => i["vehicleDetails"]["manuId"]) // Llenamos con los id de marcas
        let idMarcas = tecdoc3['array'].map(i => i["vehicleDetails"]["manuName"]) //Llenamos con las descipciondes de marcas
        //Obtenmos un DISTINCT para extraer un solo valor por manufactor en caso de existir un manufactor repetido
        const id_manu_unico = [...new Set(idManus)]; //Aplicamos un distinct a los id de marca
        const id_marca_unico = [...new Set(idMarcas)]; //Aplicamps un distinct a las descipciones de las marcas obtenidas
        let marcaf; //Variable para guardar las marcas
        let jsonIdManuDatos = []; //Variable para guardar los Manufactores de los vehiculos
        let jsonFinal = [] //Variable para el Json Final donde ira todo el resultado
        id_manu_unico.forEach(ite => { //forEach para llenar el json de id de manufactores de vehiculos
          //Obtenemos una marca para agregarla al ID del json junto con el id de la marca retornada por TECDOC
          let i_marca; //Variable para la marca
          vei.forEach(imar => { //forEach para obtener la Marca que se ingresara n el json
            //Compramos si el id marca es la misma contenida para el id correspondiente agregado al json

            if (imar["manuId"] == ite) { //Comprobamos que la marca se ingrese en el id manufactor correcto
              //Seteamos la marca para llamarla posteriormente
              marcaf = imar["manuName"] //Guardamos la descripcion de la marca en la variable
            }
          })
          //Insercion datos al primer nivel del json
          let marca_i = {
            id_marcav: ite,
            es_select: false,
            marca: marcaf
          } //Creamos el emcabezado de la primera cascada el Json (Id marca y descipcion de marca)

          //Comenzamos a llenar el json que mostrara la guia del vendedo
          jsonFinal.push( //Push para insertar el primer Emcabezado de la cascada del JSON
            marca_i //Variable de datos de la primera cascada
          )
        })
        jsonFinal.forEach(ii => { ///Recorremos la primera cascada del json para validar inserciones

          ii.modelo = [] //Declaramos el arreglo de datos para insertar modelos
          tecdoc3['array'].forEach(it => { //Recorremos el arreglo retornado por la funcion principal para capturar los datos de compraracion

            if (it["vehicleDetails"]["manuId"] == ii.id_marcav) { //Condicionante para saber si el Manufactor d la cascada es igual al dato actual para insertar
              //Segunda cascada del json con los modelos para las marcas en la primera cascada llenada en el push de arriba
              ii.modelo.push( //Si l id es igual realizamos el puch de los modelos
                it["vehicleDetails"].modelName //Intertamos el Nombre del modelo
              )
            }
          })
          const iit = ii.modelo //Contante para guardar los modelos
          let imodelo = [...new Set(iit)]; //Aplicamos un distinct para obtener un solo id de modelos por marca
          ii.modelo = [] //Declaramos vario el arreglo de los modelos
          imodelo.forEach(itm => { //Recorremos los modelos obtenidos

            let anioc = tecdoc3["array"] //Obtenemmos los años del array
            let autModelos = [] //Declaramos la variable para guardar los modelos
            let idMan = tecdoc3['array'].map(i => i["vehicleDetails"]) //Guardamos los arrar de los vehiculos retornados por la funcion principal

            idMan.forEach(im => { //Recorremos los array de los modelos retornados

              let anioofin //Variable para ser llenada con el año hasta el cual se dejo de contruir el vehiculo
              let anioo //Año desde el cual se comenzo a contruir el vehiculo
              var anioc = null //AñosC
              var aniof = null //AñosF

              if (im["modelName"] == imodelo[0]) { //Comparamos que el modelo sea igua al valor actual en el array

                try {
                  anioo = im["yearOfConstrFrom"].toString(); //Convetimos a string el año
                  anioc = anioo.substring(0, 4); //Extraemos el año
                } catch (e) {}

                try {
                  anioofin = im["yearOfConstrTo"].toString();
                  aniof = anioofin.substring(0, 4);
                } catch (e) {}
                //Aunque esta entes que el ultimo push y esta es la ultima cascada es porque llenamos todos los motores --
                //---  y luego abajo los metemos en el modelo que corresponde
                autModelos.push({ //Realizamos el push para insertar la informacion de los vehiculos del modelo seleccionado
                  "Year": `${ anioc}-${aniof}`, //Año desde el cual se comenzo a contruir ese modelo
                  "PerVehicle": null,
                  "Desc": im["typeName"], //Motor del vehiculo
                  "carid": im["carId"] //Id del vehiculo
                })
              }
            })
            //Penultimo llenado de la guia del vendedor para llenar los modelos con los motores de los vehiculos que vienen segund la guia solicitada
            ii.modelo.push({ //Creamos un encabezado para la cascada de los modelos
              "nombreModelo": itm, //Insertamos el nombre del modelo
              "es_select": false,
              "vehiculos": autModelos //Obtenemos los modelos que se insertaron arriba en la variable de los modelos
            })
          })
        }) //Fin del Json Final

        res.send(jsonFinal)

        //Enviamos la respuesta de la funcion
        ///En angular sacar solo los datos que se mostraran en el ide del vendedor

      }

    }
  }
}

function carId(tecdoc4, p_articulo) { //Si la funcion getArticleLinkedAllLinkingTarget4 retorna data ejecutamos esta para el formateo de data
  return new Promise(async (resolve, reject) => {

    let articulosArray = []; //Creamos el array de los vehiculos que le enviaremos a la funcion siguiente
    let con = 0 //Contador para el limite del proveedor de 25 articulos
    let contaF = 1 //Segundo contador para los 25 articulos segmentados
    let cantArray = Math.ceil(tecdoc4["array"][0]["articleLinkages"]["array"].length / 25) //Segmentamos los articulos en 25 cada arreglo
    var tecdocA = [] //arreglo para meter los articulos

    if (tecdoc4["array"][0]["articleLinkages"]["array"].length <= 24) { //Si la cantidad de articulos es menor a 25 ejecutamos lo siguiente
      tecdoc4["array"][0]["articleLinkages"]["array"].forEach(async (item) => {
        con++

        if (con < tecdoc4["array"][0]["articleLinkages"]["array"].length) { //Si el tanaño del arreglo del arreglo es mayor que el tamaño del contador hacemos push
          articulosArray.push( //Creamos un push a la variable de arituculos array para crear el formato que necesita la funcion siguiente
            {
              "articleLinkId": item.articleLinkId,
              "linkingTargetId": item.linkingTargetId
            }
          )
        } else {
          con = 0 //Si ya se lleno el arreglo hacemos el envio de la data y la resolvemos para el res send
          let ar = articulosArray //Guardamos el arreglo de los vehiculos en ar
          articulosArray = [] //Vaciamos el arreglo de los vehiculos
          let tcp = await tecdoc.getArticleLinkedAllLinkingTargetsByIds3(p_articulo, ar).catch(err => {})
          await tcp.forEach(async tr => {
            await tecdocA.push(tr) //Esperamos a que se llene el arreglo Tecdoc4
          })
          resolve(tecdocA) //Revolvemos el arreglo Tecdoc4
        }
      })
    } else { //Si no, ejecutamos lo siguiente
      await tecdoc4["array"][0]["articleLinkages"]["array"].forEach(async (item) => { //ForEach para llenar el arreglo de los articulos
        con++ //Sumamos contador para llegar al limite de los vehiculos en el arreglo de 25
        if (con <= 24) { //Si en contador es mejor a 24 ejecutamos lo siguiente
          articulosArray.push( //Creamos un push a la variable de arituculos array para crear el formato que necesita la funcion siguiente
            {
              "articleLinkId": item.articleLinkId,
              "linkingTargetId": item.linkingTargetId
            }
          )
        } else {

          con = 0 //Contador a cerro para comenzar a resolver la data
          let ar = articulosArray //Llenamos ar con  los datos del arreglo de los vehiculos
          articulosArray = [] //Vaciamos el arreglo de los vehiculos para su llenado posteriormente con su data final
          tecdoc.getArticleLinkedAllLinkingTargetsByIds3(p_articulo, ar).then((ult) => { //Funcion para enviar los parametros a la ultima funcion que devuelve lo requerido con lo enviado en TecdocA
            contaF++ //Sumamos el segundo contador de llenado
            tecdocA = tecdocA.concat(ult) //Llenamos a tecdocA

            resolve(tecdocA) //Resolvemos la data para la siguiente funcion que solicita esta data arriba.
          })
        }
      })
    }
  })
}
