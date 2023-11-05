import { Request, Response } from "express"
import pool from "../db"

export async function getAccountItems(
	req: Request & { user_id: string },
	res: Response
) {
	try {
		const id = req.user_id
		const { name = "", limit = 25, offset = 0 } = req.query

		console.log("getAccountItems req", req.query)

		const accountItems = await pool.query(
			"SELECT id, name, type, COUNT(*) OVER() AS total_count FROM account_item WHERE user_id = $1 AND name ILIKE $2 ORDER BY name ASC LIMIT $3 OFFSET $4",
			[id, `%${name}%`, limit, offset]
		)
		res.json({
			data: accountItems.rows,
			total_items: Number(
				accountItems.rows[0] ? accountItems.rows[0].total_count : 0
			),
			current_page: Number(offset),
		})
	} catch (err) {
		console.error(err.message)
	}
}

export async function getAccountItem(
	req: Request & { user_id: string },
	res: Response
) {
	try {
		const id = req.user_id
		const { accountItemId = "" } = req.params

		console.log("getAccountItem req", req)

		const accountItem = await pool.query(
			"SELECT * FROM account_item WHERE id = $1 AND user_id = $2",
			[accountItemId, id]
		)
		res.json(accountItem.rows[0])
	} catch (err) {
		console.error(err.message)
		res.status(400).send(err.message)
	}
}

export async function createAccountItem(
	req: Request & { user_id: string },
	res: Response
) {
	try {
		const id = req.user_id

		const { name, type } = req.body

		console.log("createAccountItem req", req)

		const account = await pool.query(
			"SELECT name FROM account_item WHERE name ILIKE $1",
			[name]
		)

		if (account.rows.length > 0) {
			return res.status(400).send("Account already exist")
		}

		const newAccountItem = await pool.query(
			"INSERT INTO account_item (name, type, user_id) VALUES($1, $2, $3) RETURNING id",
			[name, type, id]
		)
		const { id: resId } = newAccountItem.rows[0]

		return res.json({
			id: resId,
			name,
			type,
		})
	} catch (err) {
		console.error(err.message)
		res.status(400).send(err.message)
	}
}

export async function updateAccountItem(
	req: Request & { user_id: string },
	res: Response
) {
	try {
		const id = req.user_id
		const { accountItemId } = req.params
		const { name, type } = req.body

		console.log("updateAccountItem req", req)

		const updatedAccountItem = await pool.query(
			"UPDATE account_item SET name = $1, type = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
			[name, type, accountItemId, id]
		)

		console.log("updatedAccountItem", updatedAccountItem.rows[0])

		return res.json(updatedAccountItem.rows[0])
	} catch (err) {
		console.error(err.message)
		res.status(400).send(err.message)
	}
}

export async function deleteAccountItem(
	req: Request & { user_id: string },
	res: Response
) {
	try {
		const id = req.user_id
		const { accountItemId } = req.params

		console.log("deleteAccountItem req", req)

		const deletedAccountItem = await pool.query(
			"DELETE FROM account_item WHERE id = $1 AND user_id = $2",
			[accountItemId, id]
		)

		console.log("deletedAccountItem", deletedAccountItem)

		return res.json("Account item deleted")
	} catch (err) {
		console.error(err.message)
		res.status(400).send(err.message)
	}
}
