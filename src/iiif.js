/*
 * IIIF-Leipzig-Opendata
 *
 * IIIF services for Leipzig's Open Data Portal -  an entry to the Leipzig Open Data Hackathon 2023
 *
 * (c) 2023, Leander Seige, released under the GNU GPL V3, contact: leander@seige.name
 *
 *  https://github.com/leanderseige/iiif-leipzig-opendata
 *
 */

const tools = require('./tools')
const template211 = require('./template-2.1.1.json')
const template300 = require('./template-3.0.0.json')
const images = require('./images.js')

const config = require('./config.json')

exports.buildManifest2 = (id,data,logger) => {
  let manifest = tools.clone(template211.manifest)
  manifest["@id"] = config.iiifBaseUri+'/manifest/'+id
  manifest.label = data.result.title
  manifest.description = data.result.title

  manifest.metadata = data.result.extras.map( field => ({
    label: field.key,
    value: field.value
  }))

  let sequence = tools.clone(template211.sequence)
  sequence['@id'] = config.iiifBaseUri+'/manifest/'+id+'/sequence'
  manifest.sequences.push(sequence)

  let promises = []

  for(x in data.result.resources) {
    if(data.result.resources[x].format=='jpg') {
      let promise = images.loadImage(data.result.resources[x].id, data.result.resources[x].url, logger, x).then( ([dims,imageId,x]) => {
        let canvas = tools.clone(template211.canvas)
        canvas["@id"] = manifest["@id"]+'/canvas/'+data.result.resources[x].id
        canvas.width = dims.width
        canvas.height = dims.height
        canvas.label = data.result.title

        let image = tools.clone(template211.image)
        image["@id"] = manifest["@id"]+'/page/'+data.result.resources[x].id
        image.on = canvas['@id']
        image.license = data.result.license_url
        image.resource.service['@id'] = config.iiifBaseUri+'/image/'+imageId+'.ptif'
        image.resource['@id'] = image.resource.service['@id']+"/full/full/0/default.jpg"
        image.resource.width = dims.width
        image.resource.height = dims.height

        canvas.images.push(image)
        return canvas
      })
      promises.push(promise)
    }
  }

  return Promise.all(promises)
    .then(responses => {
      responses.reduce((result, data) => manifest.sequences[0].canvases.push(data), [])
      return manifest
    })
}

exports.buildManifest3 = (id,data,logger) => {
  let manifest = tools.clone(template300.manifest)

  manifest['@context'] = []

  // manifest['@context'].push(
  //   { "example":"https://www.govdata.de"}
  // )
  //
  // let rights = {}
  // rights['@type'] = '@id'
  // rights['@id'] = 'example:rights'
  // manifest['@context'].push(rights)

  // manifest['@context'].push("{\"rights\": {\"@id\": \"example:rights\", \"@type\": \"@id\"}}")

  manifest['@context'].push("http://iiif.io/api/presentation/3/context.json")

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

  let promises = []

  for(x in data.result.resources) {
    if(data.result.resources[x].format=='jpg') {
      let promise = images.loadImage(data.result.resources[x].id, data.result.resources[x].url, logger, x).then( ([dims,imageId,x]) => {
        let canvas = tools.clone(template300.canvas)
        canvas.id = manifest.id+'/canvas/'+data.result.resources[x].id
        canvas.items[0].id = manifest.id+'/page/'+data.result.resources[x].id
        canvas.width = dims.width
        canvas.height = dims.height
        let image = tools.clone(template300.image)
        image.id = manifest.id+'/image/'+data.result.resources[x].id
        image.body.service[0].id = config.iiifBaseUri+'/image/'+data.result.resources[x].id+'.ptif'
        image.body.id = image.body.service[0].id+'/full/max/0/default.jpg'
        image.body.width = dims.width
        image.body.height = dims.height
        image.target = canvas.id
        canvas.items[0].items.push(image)
        return canvas
      })
      promises.push(promise)
    }
  }

  return Promise.all(promises)
    .then(responses => {
      responses.reduce((result, data) => manifest.items.push(data), [])
      return manifest
    })
}
