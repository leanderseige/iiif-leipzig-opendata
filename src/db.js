exports.cache_table_definition = `CREATE TABLE IF NOT EXISTS cache (
  key TEXT PRIMARY KEY,
  last INTEGER,
  body BLOB
)`

exports.cache_truncate_query = `DELETE FROM cache`

exports.cache_get_query = `SELECT body, last FROM cache WHERE key = ? `

exports.cache_store_query = `REPLACE INTO cache(
  key,
  last,
  body
)
VALUES(?,?,?)
`
