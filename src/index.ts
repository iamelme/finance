import express, { Application } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import authorizeUser from "./middleware/authorize"
import credentials from "./middleware/credential"
import register from "./routes/register"
import login from "./routes/login"
import protectedRoutes from "./routes"
import refresh from "./routes/refresh"

import whitelist from "./utils/whitelist"

import dotenv from "dotenv"
dotenv.config()

const app: Application = express()
const port = process.env.PORT || 4000

app.use(credentials)
app.use(
	cors({
		origin: (origin, callback) => {
			console.log("origin", origin, whitelist.indexOf(origin) !== -1 || !origin)
			if (whitelist.indexOf(origin) !== -1 || !origin) {
				callback(null, true)
			} else {
				callback(new Error())
			}
		},
		credentials: true,
		optionsSuccessStatus: 200,
	})
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json()) // req.body
app.use(cookieParser())

app.use("/api", register)
app.use("/api", login)
app.use("/api", refresh)

app.use(authorizeUser)
app.use("/api", protectedRoutes)
// app.use("/api", user)
// app.use("/api", journals)

app.listen(port)
