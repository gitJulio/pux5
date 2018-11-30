const pg = require('../../configuration/ps_connection')

exports.autoComplete = async function(req, res) {
  //Funcion paa hacer la busqueda inteligente en la base de datos para smart seach
  let autocompletar = await pg.func('api_catalogo.ft_autocomplete_search', req.params.text_busqueda).catch(err => {

    res.status(500).send({
      error: err,
      status: 500
    }); // si existe un error lo retornamos
  })
  if (res.statusCode != 200) {
    return
  }
  res.send(autocompletar) //Si no existe error retornamos la data solicitada por la peticion
}
