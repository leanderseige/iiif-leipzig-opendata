const tools = require('./tools')

const template211 = require('./template-2.1.1.json')
const template300 = require('./template-3.0.0.json')

const config = require('./config.json')

exports.buildManifest2 = (p,record,lidoUrl) => {
  let data = tools.clone(template211.manifest)
}

exports.buildManifest3 = (p,record,lidoUrl) => {
  let data = tools.clone(template300.manifest)
  return data
}
