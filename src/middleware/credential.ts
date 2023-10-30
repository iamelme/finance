import { NextFunction, Request, Response } from "express"

const whitelist = [
	"https://localhost:5173",
	"http://localhost:3000",
	"http://localhost:4000",
	"http://127.0.0.1:5173",
	"http://127.0.0.1:5173/",
]

export default function credentials(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const origin = req.headers.origin
	// console.log("credentials origin", origin)
	if (whitelist.includes(origin)) {
		// console.log("credentials whitelist includes origin ===== okay")
		res.header("Access-Control-Allow-Origin", origin)
		res.header("Access-Control-Allow-Credentials", "true")
		// res.header(
		// 	"Access-Control-Allow-Headers",
		// 	"Origin, X-Requested-With, Content-Type, Accept"
		// )
	}
	// res.header("Access-Control-Allow-Origin", origin)
	// res.header("Access-Control-Allow-Credentials", "true")
	// res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
	// res.header(
	// 	"Access-Control-Allow-Headers",
	// 	"Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
	// )
	next()
}
