let pg = require('../../configuration/ps_connection')

exports.PROVEEDORES = {
  ALLAS:1,
  TECDOC:2,
  WHI:3,
  PARTSCATALOG:4
}

exports.Proveedor = function(p_proveedor) {
    return new Promise((resolve, reject) => {
          pg.func('api_catalogo.ft_proc_config_proveedores', p_proveedor).then(data =>{
            resolve(data[0])
          }).catch(err =>{
              resolve(err)
          })
    })
}
