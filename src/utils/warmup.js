const fetch = require('cross-fetch')
const config = require('../config.json')

fetch('https://opendata.leipzig.de/api/3/action/dataset_search?fq=res_format:jpg&rows=1000').then(
  (response) => response.json()
).then( async (data) => {
  for(x in data.result.results) {
    // let murl = config.iiifBaseUri+"/manifest/"+data.result.results[x].id
    let murl = "http://localhost:2000/manifest/"+data.result.results[x].id
    console.log("Processing "+murl)
    await fetch(murl)
  }
})
