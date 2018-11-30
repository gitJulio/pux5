const timeO = require('./timeout_niveles')
var fs = require('fs');
const timeconfig = fs.readFileSync('./configuration/timeout.json', 'utf8');

/*
  Esta funcion obtiene las imagenes del proveedor WHI
*/
exports.cambiarTimeOut = async function(req, res, next) {
  let priority = req.body.prioridad

  priority = priority.toLowerCase()

  if (priority == "normal" || priority == "nohay" || priority == "lento") {

    let arrayTime = JSON.parse(timeconfig);
    let time1 = await timeO.TIMEOUT.NIVEL1
    let time2 = await timeO.TIMEOUT.NIVEL2
    let time3 = await timeO.TIMEOUT.NIVEL3
    let time4 = await timeO.TIMEOUT.NIVEL4
    let time5 = await timeO.TIMEOUT.NIVEL5
    let nuevo_time1, nuevo_time2, nuevo_time3, nuevo_time4, nuevo_time5

    for (var i = 0; i < arrayTime.length; i++) {
      nuevo_time1 = arrayTime[0]["timeout"]["nivel"]["1"]["prioridad"][priority]
      nuevo_time2 = arrayTime[0]["timeout"]["nivel"]["2"]["prioridad"][priority]
      nuevo_time3 = arrayTime[0]["timeout"]["nivel"]["3"]["prioridad"][priority]
      nuevo_time4 = arrayTime[0]["timeout"]["nivel"]["4"]["prioridad"][priority]
      nuevo_time5 = arrayTime[0]["timeout"]["nivel"]["5"]["prioridad"][priority]
      nuevo_time6 = arrayTime[0]["timeout"]["nivel"]["6"]["prioridad"][priority]
    }
    //
    // console.log(`exports.TIMEOUT = {\nNIVEL1: ${nuevo_time1},\nNIVEL2: ${nuevo_time2},\nNIVEL3: ${nuevo_time3},\nNIVEL4: ${nuevo_time4},\nNIVEL5: ${nuevo_time5},\n }`);
    fs.writeFile('./configuration/timeout_niveles.js', `exports.TIMEOUT = {\nNIVEL1: ${nuevo_time1},\nNIVEL2: ${nuevo_time2},\nNIVEL3: ${nuevo_time3},\nNIVEL4: ${nuevo_time4},\nNIVEL5: ${nuevo_time5},\nNIVEL6: ${nuevo_time6},\n }`, error => {
      if (error) {
        let mal = [{
          "status": error,
          "mensaje": "Los cambios se actualizaron correctamente!"
    }]
        res.send(bien)
      } else {
        let bien = [{
          "status": 200,
          "mensaje": "Los cambios se actualizaron correctamente!"
      }]
        res.send(bien)
      }
    });
  } else {
    let mal = [{
      "status": 200,
      "mensaje": `No se pueden realizar los cmabios, la prioridad ( ${priority} ) no existe`
    }]
    res.send(mal)
  }
}


//@Carlos
