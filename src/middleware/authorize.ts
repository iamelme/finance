import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

import dotenv from "dotenv"
dotenv.config()

const secret = process.env.JWT_SECRET

export default function authorize(
	req: Request & { user?: string; isAdmin?: boolean; user_id?: string },
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers["authorization"]

	if (!authHeader) {
		return res.status(401).json({
			code: 401,
			message: "No authorization header",
		})
	}

	const token = authHeader?.split(" ")[1]
	try {
		const decode = jwt.verify(token, secret)

		console.log(" authorize decode", decode)

		req.user = decode.user_name
		req.isAdmin =
			decode.roles.includes("admin") || decode.roles.includes("super-admin")
		req.user_id = decode.user_id
		next()
	} catch (err) {
		console.error(err + " authorizeUser")

		return res.sendStatus(401)
	}
}
