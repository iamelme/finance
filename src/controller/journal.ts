import { Request, Response } from "express"

import pool from "../db"

export async function getJournals(
	req: Request & {
		user_id: string
		user_name: string
		query: {
			startDate: Date
			endDate: Date
			sort: string
			type: string[]
			searchText: string
			limit: string
			offset: string
		}
	},
	res: Response
) {
	try {
		const id = req.user_id

		console.log("getJournals req.query", req.query)
		const {
			startDate,
			endDate,
			sort = "DESC",
			type = [],
			searchText = "",
			limit = 25,
			offset = 0,
		} = req.query

		const typeRevenue = type.find((t) => t === "Revenue") ? "Revenue" : ""
		const typeExpense = type.find((t) => t === "Expense") ? "Expense" : ""

		const query = `SELECT j.user_id, j.human_id, u.first_name, u.last_name, j.id, j.date, j.amount, j.note, j.document, ac.name account_name, ac.type account_type, COUNT(*) OVER() AS total_count
			FROM journal j
			 LEFT JOIN account_item ac ON ac.id = j.account_item_id 
			 LEFT JOIN users u ON u.id = j.user_id
			 WHERE j.user_id = $1 
			 ${
					startDate && endDate
						? `AND j.date::TIMESTAMPTZ >= '${startDate}'::TIMESTAMPTZ AND j.date::TIMESTAMPTZ <= '${endDate}'::TIMESTAMPTZ`
						: ""
				}
				AND ac.type IN ($2, $3)
				    ${searchText && `AND j.document @@ to_tsquery('${searchText}:*')`}
							 ORDER BY j.date ${sort}
			 LIMIT $4 OFFSET $5`

		// console.log("query", query)

		const journals = await pool.query(query, [
			id,
			typeRevenue,
			typeExpense,
			limit,
			offset,
		])
		res.json({
			data: journals.rows,
			total_items: Number(journals.rows[0] ? journals.rows[0].total_count : 0),
			current_page: Number(offset),
			// currentPage: Math.ceil(Number(offset) / Number(limit)) + 1,
		})
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

	const query = `INSERT INTO journal 
	(date, amount, note, user_id, account_item_id, document)
	VALUES($1, $2, $3, $4, $5, to_tsvector('${amount}' || ' ' || coalesce('${note}', '')))
	RETURNING *`

	try {
		const newJournal = await pool.query(query, [
			date,
			amount,
			note,
			id,
			account,
		])

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

	const query = `UPDATE journal 
	SET date = $1, amount = $2, account_item_id = $3, note = $4, 
	document = to_tsvector('${amount}' || ' ' || coalesce('${note}', '')) 
	WHERE id = $5`

	try {
		const updatedJournal = await pool.query(query, [
			date,
			amount,
			account,
			note,
			journalId,
		])

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
