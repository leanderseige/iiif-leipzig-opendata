const fetch = require('cross-fetch')

fetch('https://opendata.leipzig.de/api/3/action/dataset_search?fq=res_format:jpg&rows=1000').then(
  (response) => response.json()
).then((data) => {
  for(x in data.result.results) {
    console.log(data.result.results[x].id)
  }
})
