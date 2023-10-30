import { Pool, Query } from "pg"

const pool = new Pool({
	user: "elme",
	host: "localhost",
	database: "finances",
})

export default pool
