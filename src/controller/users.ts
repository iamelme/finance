import { Request, Response } from "express"

import pool from "../db"

export async function getUsers(
	req: Request & { isAdmin: boolean },
	res: Response
) {
	if (!req.isAdmin) {
		return res.sendStatus(403)
	}
	try {
		const users = await pool.query("SELECT * FROM users")
		res.json(users.rows)
	} catch (err) {
		console.error(err + " error in getUsers")
		res.sendStatus(401)
	}
}

export async function getUser(
	req: Request & { isAdmin: boolean },
	res: Response
) {
	if (!req.isAdmin) {
		return res.sendStatus(403)
	}
	try {
		const { id } = req.params
		const user = await pool.query("SELECT * FROM users WHERE id= $1", [id])
		console.log("user", user.rows[0])
		res.json(user.rows[0])
	} catch (err) {
		console.error(err.message)
	}
}

export async function deleteUser(
	req: Request & { isAdmin: boolean },
	res: Response
) {
	if (!req.isAdmin) {
		return res.sendStatus(403)
	}
	try {
		const { id } = req.params
		const user = await pool.query("DELETE FROM users WHERE id = $1", [id])
		res.send("User deleted")
	} catch (err) {
		console.error(err.message)
	}
}
