// Imports de funciones
let getmarcas = require('./getmarcas')
let getanio = require('./getanios')
let getmodelos = require('./getmodelos')
let getmotores = require('./getmotores')
let getversiones = require('./getversiones')
let getDecodeVin = require('./getDecodeVin')
let getMotorById = require('./getVehiculoById')
let getbuyer_guie = require('./getBuyerGuie')
let getVehiculoIdP = require('./getVehiculoIdProveedor')
var cambiarTimeOut = require('../../configuration/timeoutConfig');
//Exports encabezado de funciones
exports.getAnios = getanio.getAnios
exports.getMarcas = getmarcas.getMarcas
exports.getModelos = getmodelos.getModelos
exports.getMotores = getmotores.getMotores
exports.getVersiones = getversiones.getVersiones
exports.getMotoresPcg = getmotores.getMotoresPcg
exports.getVin = getDecodeVin.getVin
exports.getMotorById = getMotorById.getMotorById
exports.getBuyerGuie = getbuyer_guie.getBuyerGuie
exports.getVehiculoIdP = getVehiculoIdP.getVehiculoIdP
exports.cambiarTimeOut = cambiarTimeOut.cambiarTimeOut;
