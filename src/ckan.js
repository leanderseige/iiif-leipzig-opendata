const Database = require('better-sqlite3')
const fetch = require('cross-fetch')
const { v5 } = require('uuid')
const config = require('./config.json')
const tools = require('./tools.js')
const iiif = require('./iiif.js')
const { cache_table_definition, cache_get_query, cache_store_query, cache_truncat_query } = require('./db')
// const iiif = require('./iiif')

async function getCachedFetch(query, useCache, logger) {
  let key = v5(query,'3c0fce3d-6601-45fb-813d-b0c6e823ddfa')

  const db = new Database('cache.db')
  const stmt_get = db.prepare(cache_get_query)
  const stmt_store = db.prepare(cache_store_query)

  if(useCache) {
    let cacheresult = stmt_get.get(key)
    if(cacheresult) {
      let now = Math.round(Date.now()/1000)
      let age = now-cacheresult.last
      if(config.cacheMaxAge===-1 || age<config.cacheMaxAge) {
        logger.info("Returning backend cache data.")
        let retval = tools.clone(cacheresult.body)
        db.close()
        return retval
      }
    }
  }

  try {
    const response = await fetch(query)
    if (!response.ok) {
      // throw new Error('getCachedFetch: response code was not `ok`')
      logger.error('getCachedFetch: response code was not `ok`')
      return false
    }
    const body = await response.json()
    // stmt_store.run(key, Math.round(Date.now()/1000), body)
    db.close()
    return body

  } catch (e) {
    db.close()
    logger.error('Error: '+e)
    return false
  }
}

exports.getManifest = async (p,logger,req) => {
  let url = `https://opendata.leipzig.de/api/3/action/package_show?id=`+p
  logger.info("Fetching fresh data: "+url)
  let data = await getCachedFetch(url,true,logger)
  manifest = iiif.buildManifest3(p.logger,req)

  manifest.id = config.iiif_manifest_base+p
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

  if(!data) {
    logger.error("Can't generate IIIF Manifest")
  }

  return manifest
}

exports.getCollection = async (p,logger,req) => {
  return "data"
}
