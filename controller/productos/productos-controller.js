// Imports de funciones
var getProductoById = require('./getProductoById');
var PoductosByGroup = require('./getProductosByGroup');
var PartesCatalog = require('./getPartesCatalog');
var getProductosByOem = require('./getProductosByOem');
var getImagenes = require('./getImagenes');
var getProductosByAtributos = require('./getProductosByAtributos');
var getArticlesByCriterialFilter = require('./getProductosByFilter');

//Exports encabezado de funciones
exports.getProductoById = getProductoById.getProductoById;
exports.getProductoByGrupo = PoductosByGroup.getProductoByGrupo;
exports.getPartesCatalog = PartesCatalog.getPartesCatalog;
exports.getProductosByOem = getProductosByOem.getProductosByOem;
exports.getImagenes = getImagenes.getImagenes;
exports.getProductosByAtributos = getProductosByAtributos.getProductosByAtributos;
exports.getArticlesByCriterialFilter = getArticlesByCriterialFilter.getArticlesByCriterialFilter;
