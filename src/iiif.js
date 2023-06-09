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
      let [dims,imageId] = images.loadImage(data.result.resources[x].url, logger)
      let canvas = tools.clone(template300.canvas)
      canvas.id = manifest.id+'/canvas/'+data.result.resources[x].id
      canvas.items[0].id = manifest.id+'/page/'+data.result.resources[x].id
      canvas.width = dims.width
      canvas.height = dims.height
      let image = tools.clone(template300.image)
      image.id = manifest.id+'/image/'+data.result.resources[x].id
      image.body.service[0].id = config.iiifBaseUri+'/image/'+imageId
      image.body.id = image.body.service[0].id+'/full/max/0/default.jpg'
      image.body.width = dims.width
      image.body.height = dims.height
      image.target = canvas.id
      canvas.items[0].items.push(image)
      manifest.items.push(canvas)
    }
  }

  return manifest
}
