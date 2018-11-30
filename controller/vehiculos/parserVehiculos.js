const Proveedor_conf = require('../../controller/Proveedores/proveedores-config');

exports.ALLAS = async function(p_vehiculo, p_field) {
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.ALLAS)[0]['id_vehiculo']
        } catch (e) {}
        break;
      case 'exist':
        try {
          if (p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.ALLAS)) {
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
exports.TECDOC = function(p_vehiculo, p_field) {
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.TECDOC)[0]['id_vehiculo']
        } catch (e) {}
        break;
      case 'exist':
        try {
          if (p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.TECDOC).length > 0) {
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
exports.WHI = function(p_vehiculo, p_field) {
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI)[0]['id_vehiculo']
        } catch (e) {}
        break;
        case 'Base_and_Engine':
          try {
            let base = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI)[0]['base_vehicle']
            let engine = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI)[0]['engine_id']

            respond = {
              base_vehicle:base,
              engine_id:engine
            }

          } catch (e) {}
          break;
      case 'exist':
        try {
          if (p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI).length > 0) {
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
exports.PARTCATALOG = function(p_vehiculo, p_field) {
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id':
        try {
          respond = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG)[0]['id_vehiculo']
        } catch (e) {}
        break;
      case 'marca':
        try {
          respond = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG)[0]['marca']
        } catch (e) {}
        break;
      case 'id_and_marca':
        try {
          let vMarca = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG)[0]['marca']
          let vId = p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG)[0]['id_vehiculo']
          respond = {
            id : vId,
            marca:vMarca
          }
        } catch (e) {}
        break;
      case 'exist':
        try {
          if (p_vehiculo.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.PARTSCATALOG).length > 0) {
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
