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

 exports.clone = (i) => {
  return JSON.parse(JSON.stringify(i))
}
