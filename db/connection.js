const { Pool } = require("pg")

if (!process.env.PGDATABASE) {
  throw new Error("NO PGDATABASE SET...")
}

const db = new Pool()

module.exports = { db }
