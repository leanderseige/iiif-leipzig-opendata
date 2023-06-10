const config = require('./config.json')
const fs = require('fs')
const { v5 } = require('uuid')
const fetch = require('cross-fetch')
const execSync = require('child_process').execSync;
const sizeOf = require('image-size')

exports.getHttpFile = (url,ifile,logger) => {
  if (fs.existsSync(ifile) && fs.statSync(ifile).size>0) {
    logger.info("Input Image present, skip downloading "+ifile)
    return
  }
  execSync(
    "wget -q -O '"+ifile+"' '"+url+"'"
  )
  return(ifile)
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
    return
  }
  let cmd = config.cmdConvert+' '+ifile+' -define tiff:tile-geometry=256x256 -compress jpeg -quality 100 "ptif:'+ofile+'"'
  logger.info(cmd)
  try {
    execSync(cmd,{stdio: 'inherit'})
  } catch(err) {
    logger.error(err);
  }
  return
}

exports.loadImage = (url,logger) => {
  let key = v5(url,'3c0fce3d-6601-45fb-813d-b0c6e823ddfa')
  let ifile = config.tempDir+'/'+key+'.jpg'
  let ofile = config.imageDir+'/'+key+'.ptif'
  this.getHttpFile(url,ifile,logger)
  this.convertImage(ifile,ofile,logger)
  dims = sizeOf(ofile)
  logger.info(dims)
  return([dims,key])
}
