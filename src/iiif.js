const tools = require('./tools')
const template211 = require('./template-2.1.1.json')
const template300 = require('./template-3.0.0.json')
const images = require('./images.js')

const config = require('./config.json')

exports.buildManifest2 = (id,data) => {
  let manifest = tools.clone(template211.manifest)
  return manifest
}

exports.buildManifest3 = (id,data,logger) => {
  let manifest = tools.clone(template300.manifest)

  manifest.id = config.iiifBaseUri+'/manifest/'+id
  manifest.label = { en: [data.result.title] }
  manifest.rights = data.result.license_url
  manifest.requiredStatement = {
    label: { en: [ "Attribution" ] },
    value: { en: [ data.result.maintainer ] }
  }
  manifest.metadata = data.result.extras.map( field => ({
    label: { en: [field.key] },
    value: { en: [field.value] }
  }))
  for(x in data.result.resources) {
    if(data.result.resources[x].format=='jpg') {
      let dims = images.loadImage(data.result.resources[x].url, logger)
      let canvas = tools.clone(template300.canvas)
      canvas.width = dims.width
      canvas.height = dims.height
      manifest.items.push(canvas)

    }
  }

  return manifest
}
