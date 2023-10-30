import { Request, Response } from "express"
import pool from "../db"

export default async function logout(req: Request, res: Response) {
	const { refreshToken } = req.cookies

	console.log("logout refreshToken", refreshToken)

	if (!refreshToken) {
		return res.sendStatus(204) // No Content
	}

	try {
		delete req.headers.authorization
		await pool.query(
			"UPDATE users SET refresh_token = '' WHERE refresh_token = $1",
			[refreshToken]
		)

		res.clearCookie("refreshToken", {
			httpOnly: true,
			maxAge: 0,
			sameSite: "none",
			secure: true,
		})

		return res.sendStatus(204) // No Content
	} catch (err) {
		console.error(err)
	}
}
