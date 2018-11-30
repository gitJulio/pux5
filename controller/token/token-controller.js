var jwt = require('jwt-simple');
var config = require('../../configuration/config');
var pg = require('../../configuration/ps_connection');

exports.getToken = function(req, res, next) {
  verificaSecretId(req, res, next, generarToken);
};

exports.decodeToken = function(p_token) {
  var decoded = jwt.decode(token, secret, false, 'HS512');
  return decode;
}


//Funciones de logica
var verificaSecretId = function(req, res, next, callback) {
  pg.any('SELECT * FROM api_catalogo.ft_proc_valida_token($1)', req.body.secret_id).then(respond => {
    if (respond[0]['ft_proc_valida_token']) {
      callback(req, res, next);
    } else {
      res.status(401).send('Error de acceso');
    }
  }).catch(err => {
    res.status(401).send('Error de acceso');
  });
}


var generarToken = function(req, res, next) {
  var payload = {
    nombre: req.body.name,
    codigoempleado: req.body.codigoempleado,
    sucursal: req.body.sucursal
  };
  var token = jwt.encode(payload, req.body.secret_id, 'HS512');
  res.send(token);
}
