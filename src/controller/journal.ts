import { Request, Response } from "express"

import pool from "../db"

export async function getJournals(
	req: Request & { user_id: string; user_name: string },
	res: Response
) {
	try {
		const id = req.user_id

		console.log("getJournals req.query", req.query)
		const { limit = 2, offset = 0 } = req.query

		const journals = await pool.query(
			`SELECT j.user_id, u.first_name, u.last_name, j.id, j.date, j.amount, j.note, ac.name account_name, ac.type account_type 
			FROM journal j
			 LEFT JOIN account_item ac ON ac.id = j.account_item_id 
			 LEFT JOIN users u ON u.id = j.user_id
			 WHERE j.user_id = $1 ORDER BY j.date DESC
			 LIMIT $2 OFFSET $3`,
			[id, limit, offset]
		)
		res.json(journals.rows)
	} catch (err) {
		console.error(err.message)
		res.status(400).send(err.message)
	}
}

export async function getJournal(
	req: Request & { user_id: string; user_name: string },
	res: Response
) {
	try {
		const id = req.user_id

		const { journalId = "" } = req.params

		const journal = await pool.query(
			"SELECT * FROM journal j LEFT JOIN account_item ac ON ac.id = j.account_item_id WHERE j.id = $1 AND j.user_id = $2",
			[journalId, id]
		)

		res.json(journal.rows[0])
	} catch (err) {
		res.status(400).send(err.message)
	}
}

export async function createJournal(
	req: Request & { user_id: string; user_name: string },
	res: Response
) {
	const id = req.user_id

	const { date, amount, note, account } = req.body

	try {
		const newJournal = await pool.query(
			"INSERT INTO journal (date, amount, note, user_id, account_item_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
			[date, amount, note, id, account]
		)

		res.json(newJournal.rows[0])
	} catch (err) {
		console.log("err.message", err.message)
		res.status(400).send(err.message)
	}
}

export async function updateJournal(
	req: Request & { user_id: string; user_name: string },
	res: Response
) {
	const id = req.user_id

	const { date, account, amount, note } = req.body

	const { journalId = "" } = req.params

	try {
		const updatedJournal = await pool.query(
			"UPDATE journal SET date = $1, amount = $2, account_item_id = $3, note = $4 WHERE id=$5",
			[date, amount, account, note, journalId]
		)

		res.sendStatus(200)
	} catch (err) {
		res.status(400).send(err.message)
	}
}

export async function deleteJournal(
	req: Request & { user_id: string; user_name: string },
	res: Response
) {
	const id = req.user_id

	const { journalId = "" } = req.params

	try {
		const deletedJournal = await pool.query(
			"DELETE FROM journal WHERE id = $1 AND user_id = $2",
			[journalId, id]
		)

		res.sendStatus(200)
	} catch (err) {
		res.status(400).send(err.message)
	}
}
