const Proveedor_conf = require('../Proveedores/proveedores-config');

exports.ALLAS = async function(p_grupos, p_field) {
  p_field = p_field.toLowerCase();
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.ALLAS)[0]['id_grupo']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'id_source':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.ALLAS)[0]['id_grupo_source']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'exist':
        try {
          if (p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.ALLAS)) {
            respond = true
          } else {
            respond = false
          }
        } catch (e) {
          respond = false
        }
        break;
    }
    resolve(respond)
  })
}
exports.TECDOC = function(p_grupos, p_field) {
  p_field = p_field.toLowerCase();
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.TECDOC)[0]['id_grupo']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'id_source':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.TECDOC)[0]['id_grupo_source']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'exist':
        try {
          if (p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.TECDOC).length > 0) {
            respond = true
          } else {
            respond = false
          }
        } catch (e) {
          respond = false
        }
        break;
    }
    resolve(respond)
  })
}
exports.WHI = function(p_grupos, p_field) {
  p_field = p_field.toLowerCase();
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI)[0]['id_grupo']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'id_source':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI)[0]['id_grupo_source']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'id_tipo':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI)[0]['id_grupo_tipo']
        } catch (e) {}
        break;
      case 'exist':
        try {
          if (p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI).length > 0) {
            respond = true
          } else {
            respond = false
          }
        } catch (e) {
          respond = false
        }
        break;
    }
    resolve(respond)
  })
}
exports.PARTCATALOG = function(p_grupos, p_field) {
  p_field = p_field.toLowerCase();
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG)[0]['id_grupo']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'id_source':
        try {
          respond = p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG)[0]['id_grupo_source']
        } catch (e) {
          if (p_grupos) {
            respond = 0
          }
        }
        break;
      case 'exist':
        try {
          if (p_grupos.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG).length > 0) {
            respond = true
          } else {
            respond = false
          }
        } catch (e) {
          respond = false
        }
        break;
    }
    resolve(respond)
  })
}
