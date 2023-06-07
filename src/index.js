const express = require('express')
const compression = require('compression')
const log4js = require('log4js')
const Database = require('better-sqlite3')
const { v5 } = require('uuid')
const fs = require('fs')

const ckan = require('./ckan.js')
const { cache_table_definition, cache_get_query, cache_store_query, cache_truncate_query } = require('./db')
const config = require('./config.json')

// Logger
log4js.configure({
  appenders: {
    svfile: { type: 'file', filename: 'logfile.log' },
    svout: { type: 'stdout' }
  },
  categories: { default: { appenders: ['svfile','svout'], level: 'info' } }
})
const logger = log4js.getLogger()
logger.level = 'INFO'

// Database
const db = new Database('cache.db')
db.exec(cache_table_definition)
if(config.cacheClearOnStartup) {
  db.exec(cache_truncate_query)
}
const stmt_get = db.prepare(cache_get_query)
const stmt_store = db.prepare(cache_store_query)

// Run Server
const app = express()
app.use(compression())

app.all('*', function (req, res, next) {

  // checking new query

	let p = req.url.split("/")
	p.shift()

	if(p.length!=2) {
    res.status(404).send("Error. Illegal query type 1")
    logger.info("Error. Illegal query type 1")
		return
	}

	if( ! (['manifest','collection'].includes(p[0])) ) {
    res.status(404).send("Error. Illegal query type 2")
    logger.info("Error. Illegal query type 2")
		return
	}

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Content-Type', 'application/json')

  let key = v5(config.baseurl+req.url,'3c0fce3d-6601-45fb-813d-b0c6e823ddfa')


  const [getData, errMessageForClient] = p[0] === 'collection'
  ? [ckan.getCollection, 'Error getting collection']
  : [ckan.getManifest, 'Error getting manifest']

  getData(p[1], logger).then(data => {
    if(config.caching) {
      logger.info("Updating cache.")
      console.log("key: "+key)
      fs.writeFile("last_cache.blob", JSON.stringify(data), ()=>{} )
      stmt_store.run(key, Math.round(Date.now()/1000), JSON.stringify(data))
    }
    logger.info("Sending data.")
    res.json(data)
  })
  .catch(error => {
    logger.error(error)
    res.status(500).send(errMessageForClient)
  })


})

app.listen(config.port,config.interface)
logger.info('Listening on '+config.interface+":"+config.port)
