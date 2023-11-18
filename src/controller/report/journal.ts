import { Request, Response } from "express"

import pool from "../../db"

export async function getReportJournal(
	req: Request & { user_id: string },
	res: Response
) {
	console.log("getReportJournal req", req.query)
	const id = req.user_id
	if (!id) {
		return res.status(400).send("No user id")
	}

	const { startDate, endDate, accountRevenueId, accountExpenseId } = req.query

	// check differenceInCalendarDays if less or equal 7 days

	// const query = `SELECT ac.type,

	// `

	// check differenceInCalendarDays if more than 7 days

	const rangeDate = `AND j.date::TIMESTAMPTZ >= '${startDate}'::TIMESTAMPTZ AND j.date::TIMESTAMPTZ <= '${endDate}'::TIMESTAMPTZ`

	// if()

	const query = `SELECT ac.type,
	SUM(j.amount) AS monthly_total,
	date_part('year', j.date) AS year,
	date_part('month', j.date) AS month
	FROM journal j
	JOIN account_item ac ON j.account_item_id = ac.id 
	WHERE j.user_id = $1 
	${startDate && endDate ? rangeDate : ""}
	AND ac.id IN ($2, $3)
	GROUP BY ac.type, year, month
	ORDER BY year, month ASC`

	try {
		const report = await pool.query(query, [
			id,
			accountRevenueId,
			accountExpenseId,
		])

		console.log("report.rows", report.rows)

		res.json(report.rows)
	} catch (err) {
		console.error(err.message)
		res.status(400).send(err.message)
	}
}
