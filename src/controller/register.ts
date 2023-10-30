import type { Request, Response } from "express"
import bcrypt from "bcrypt"

import pool from "../db"

export default async function register(req: Request, res: Response) {
	try {
		const {
			first_name,
			last_name,
			email,
			user_name,
			password,
			country_code,
			locale,
			currency,
		} = req.body

		if (!first_name || !last_name || !email || !user_name || !password)
			return res.status(400).send("Missing fields")

		const user = await pool.query(
			"SELECT * FROM users WHERE email = $1 OR user_name = $2",
			[email, user_name]
		)

		if (user.rows.length > 0) {
			return res.status(400).send("User already exist")
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await pool.query(
			"INSERT INTO users (first_name, last_name, email, user_name, country_code, locale, currency, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, first_name, last_name, email, user_name, country_code, locale, currency",
			[
				first_name,
				last_name,
				email,
				user_name,
				country_code,
				locale,
				currency,
				hashedPassword,
			]
		)
		res.send(newUser.rows[0])
	} catch (e) {
		console.error(e)
		res.status(500).send("Server error")
	}

	// return res.send({ body: req.body })
}
