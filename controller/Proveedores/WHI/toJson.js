const request = require('request')
let Proveedores_config = require('../proveedores-config')
var parser = require('fast-xml-parser');
var he = require('he');

exports.toJson = async function(data) {
  return new Promise((resolve, reject) => {
    let xmlData = data
    var options = {
      attributeNamePrefix: "",
      attrNodeName: "",
      textNodeName: "text",
      ignoreAttributes: false,
      ignoreNameSpace: false,
      allowBooleanAttributes: true,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true,
      cdataTagName: "__cdata",
      cdataPositionChar: "\\c",
      localeRange: "",
      parseTrueNumberOnly: false,
      attrValueProcessor: a => he.decode(a, {
        isAttributeValue: true
      }),
      tagValueProcessor: a => he.decode(a)
    };
    var json = parser.parse(xmlData, options);
    resolve(json)
  })
  //@Carlos
}
