const fetch = require('cross-fetch')
const config = require('../config.json')

console.log("Fetching list of datasets ...")
fetch('https://opendata.leipzig.de/api/3/action/dataset_search?fq=res_format:jpg&rows=1000').then(
  (response) => response.json()
).then( async (data) => {
  console.log("Start Processing.\nFinished datasets:")
  for(x in data.result.results) {
    // let murl = config.iiifBaseUri+"/manifest/"+data.result.results[x].id
    let murl = "http://localhost:2000/manifest/"+data.result.results[x].id
    await fetch(murl)
    console.log(murl)
  }
  console.log("Done.")
})
