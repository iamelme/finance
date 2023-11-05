import { Response, Request, Router } from "express"
import bcrypt from "bcrypt"

import dotenv from "dotenv"
dotenv.config()

import pool from "../db"
import { generateToken } from "../utils"

export default async function login(req: Request, res: Response) {
	console.log("login req.body", req.body)
	try {
		const { email, user_name, password } = req.body

		const user = await pool.query(
			"SELECT * FROM users WHERE email = $1 OR user_name = $2",
			[email, user_name]
		)

		if (user.rows.length === 0) {
			return res.status(401).json("Invalid email/username/password")
		}

		const isPasswordValid = await bcrypt.compare(
			password,
			user.rows[0].password
		)

		if (!isPasswordValid || !user.rows[0].is_active) {
			return res.status(401).json("Invalid email/username/password")
		}

		const accessToken = generateToken({
			user_id: user.rows[0].id,
			email: user.rows[0].email,
			user_name: user.rows[0].user_name,
			roles: user.rows[0].roles,
		})
		const refreshToken = generateToken(
			{
				user_id: user.rows[0].id,
				email: user.rows[0].email,
				user_name: user.rows[0].user_name,
				roles: user.rows[0].roles,
			},
			"7d"
		)

		// store refresh token into login user
		await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
			refreshToken,
			user.rows[0].id,
		])

		// res.cookie("accessToken", accessToken, {
		// 	maxAge: 120000, // 2 minutes
		// 	httpOnly: true,
		// })

		const userRow = user.rows[0]

		res
			.cookie("refreshToken", refreshToken, {
				maxAge: 6.048e8, // 7 days
				httpOnly: true,
				secure: true,
				sameSite: "none",
			})
			.json({
				id: userRow.id,
				email: userRow.email,
				firstName: userRow.first_name,
				lastName: userRow.last_name,
				roles: userRow.roles,
				countryCode: userRow.country_code,
				locale: userRow.locale,
				currency: userRow.currency,
				accessToken,
				// refreshToken,
			})
	} catch (e) {
		console.error(e)
		res.status(500).send("Server error")
	}
}
