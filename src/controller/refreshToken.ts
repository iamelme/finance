import { Request, Response } from "express"
import jwt from "jsonwebtoken"

import pool from "../db"
import { generateToken } from "../utils"

export default async function refreshToken(
	req: Request & { user_id: string },
	res: Response
) {
	const { refreshToken = "" } = req.cookies
	if (!refreshToken) {
		console.log("no refresh token refreshToken controller")
		return res.sendStatus(401)
	}

	try {
		const foundUser = await pool.query(
			"SELECT * FROM users WHERE refresh_token = $1",
			[refreshToken]
		)

		console.log("foundUser", foundUser.rows[0])
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)

		if (!foundUser.rows[0]) {
			await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
				null,
				decoded.user_id,
			])

			console.log("verify", decoded)

			return res.status(403).json("Not authorized")
		}

		if (foundUser.rows[0].refresh_token !== refreshToken) {
			return res.sendStatus(403)
		}

		const newAccessToken = generateToken({
			user_id: decoded.user_id,
			email: decoded.email,
			user_name: decoded.user_name,
			roles: decoded.roles,
		})

		res.json({ accessToken: newAccessToken })
	} catch (err) {
		console.error(err + "refresh")
		res.json({
			code: 403,
			message: "Not authorized",
		})
	}
}
