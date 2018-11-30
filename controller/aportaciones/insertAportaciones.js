const pg = require('../../configuration/ps_connection');


exports.insertAportaciones =  async function(req, res, next){

  let codigoempleado_aportante=req.body.codigoempleado_aportante
  let cantidad=req.body.cantidad
  let id_aportacion_motivo=req.body.id_aportacion_motivo
  let id_aportacion_tipo=req.body.id_aportacion_tipo


  //Insertamos en la tabla de aportaciones
  let insertAp =
  await pg.func('api_catalogo.ft_proc_insertar_aportaciones',
  [codigoempleado_aportante,cantidad,id_aportacion_motivo,id_aportacion_tipo]).catch( err => {
         res.status(500).send({menssage:"Error al insertar",status:500});
       });

       if(res.statusCode ==200){
         res.status(200).send({menssage:"Success",status:200});
       }
};
