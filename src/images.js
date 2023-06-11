const config = require('./config.json')
const fs = require('fs')
const { v5 } = require('uuid')
const fetch = require('cross-fetch')
const execSync = require('child_process').execSync
const exec = require('child_process').exec
const sizeOf = require('image-size')

exports.getHttpFile = (url,ifile,logger) => {
  if (fs.existsSync(ifile) && fs.statSync(ifile).size>0) {
    logger.info("Input Image present, skip downloading "+ifile)
    return Promise.resolve()
  }
  let cmd = config.cmdWget+" -q -O '"+ifile+"' '"+url+"'"

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        logger.error('Error:', error)
        reject(error)
      } else if (stderr) {
        logger.error('Command execution failed:', stderr)
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

exports.convertImage = (ifile,ofile,logger) => {
  // let subdir = image_id.substring(0, 2)
  // shell.mkdir('-p',config.imagedir+"/"+source_id+"/"+subdir+"/")
  // let reli = "/"+source_id+"/"+subdir+"/"+image_id
  // let i = config.cachedir+reli
  // let relo = "/"+source_id+"/"+subdir+"/"+image_id+".ptif"
  // let o = config.imagedir+relo
  if (fs.existsSync(ofile) && fs.statSync(ofile).size>0) {
    logger.info("IIIF Image present, skip converting "+ofile)
    return Promise.resolve()
  }
  let cmd = config.cmdNice+' -n 19 '+config.cmdConvert+' '+ifile+' -define tiff:tile-geometry=256x256 -compress jpeg -quality 100 "ptif:'+ofile+'"'
  logger.info(cmd)
  // return exec(cmd,{stdio: 'inherit'})
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        logger.error('Error:', error)
        reject(error)
      } else if (stderr) {
        logger.error('Command execution failed:', stderr)
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

exports.loadImage = (id, url, logger, x) => {
  // let key = v5(url,'3c0fce3d-6601-45fb-813d-b0c6e823ddfa')
  let key = id
  let ifile = config.tempDir+'/'+key+'.jpg'
  let ofile = config.imageDir+'/'+key+'.ptif'
  return this.getHttpFile(url,ifile,logger).then( () => {
    return this.convertImage(ifile,ofile,logger).then( () => {
      let dims = sizeOf(ofile)
      logger.info(dims)
      logger.info(key)
      return Promise.resolve([dims,key,x])
    })
  })
}
