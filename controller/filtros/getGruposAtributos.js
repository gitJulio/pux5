const pg = require('../../configuration/ps_connection');


exports.getGruposAtributos =  async function(req, res, next){

  //Obtenemos todos los grupos de la base de datos
  let getGruposAtributos = await pg.func('api_catalogo.ft_proc_filtros_getgrupos').catch( err => {
         res.status(500).send({menssage:"Error al insertar",status:500});
       });

       if(res.statusCode ==200){
         res.send(getGruposAtributos)
       }

};
