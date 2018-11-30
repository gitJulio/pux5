const Proveedor_conf = require('../Proveedores/proveedores-config');


//*****************************************************************************
// return {
//   id_criterial
//   raw_value
// }

exports.ALLAS = async function(p_criterial, p_field) {
  p_field = p_field.toLowerCase();
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id_and_rawvalue':
        try {
          respond = p_criterial.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.ALLAS)[0]

          if (!respond) respond = "0"

          respond = {
            id_criterial: respond.id_criterial,
            raw_value: respond.raw_value
          }
        } catch (e) {
          respond = "0"
        }
        break;
    }
    resolve(respond)
  })
}

exports.TECDOC = function(p_criterial, p_field) {
  p_field = p_field.toLowerCase();
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id_and_rawvalue':
        try {
          respond = p_criterial.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.TECDOC)[0]

          if (!respond) respond = "0"

          respond = {
            id_criterial: respond.id_criterial,
            raw_value: respond.raw_value
          }

        } catch (e) {
          respond = "0"
        }
        break;
    }
    resolve(respond)
  })
}

exports.WHI = function(p_criterial, p_field) {
  p_field = p_field.toLowerCase();
  return new Promise((resolve, reject) => {
    let respond
    switch (p_field) {
      case 'id_and_rawvalue':
        try {
          respond = p_criterial.filter(item => item.id_proveedor === Proveedor_conf.PROVEEDORES.WHI)[0]

          if (!respond) respond = "0"

          respond = {
            id_criterial: respond.id_criterial,
            raw_value: respond.raw_value
          }

        } catch (e) {
          respond = "0"
        }
        break;
    }
    resolve(respond)
  })
}
