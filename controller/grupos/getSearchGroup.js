const pg = require('../../configuration/ps_connection');


exports.getSearchGroup =  async function(req, res, next){
   pg.func('api_catalogo.ft_proc_obtiene_grupo_api',req.params.idgrupo).then( data=>{
           res.send(data)
     }).catch( err => {
       res.statusCode(500).send({status:500, error:"error en base de datos"})
     });
}
