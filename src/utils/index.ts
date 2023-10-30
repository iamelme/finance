import jwt from "jsonwebtoken"

import dotenv from "dotenv"
dotenv.config()

const secret = process.env.JWT_SECRET

export function generateToken(
	payload: {
		user_id: string
		email: string
		user_name: string
		roles: string[]
	},
	expiresIn: string = "10s"
) {
	console.log("payload", payload)
	return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn })
}

export function verifyToken(token: string) {
	try {
		const decode = jwt.verify(token, secret)

		return {
			payload: decode,
			isExpired: false,
		}
	} catch (err) {
		return {
			payload: null,
			isExpired: true,
			message: err.message.include("jwt expired"),
		}
	}
}
