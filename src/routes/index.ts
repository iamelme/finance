import express, { Router } from "express"

import {
	createJournal,
	deleteJournal,
	getJournal,
	getJournals,
	updateJournal,
} from "../controller/journal"
import { deleteUser, getUser, getUsers } from "../controller/users"
import logout from "../controller/logout"
import {
	createAccountItem,
	deleteAccountItem,
	getAccountItem,
	getAccountItems,
	updateAccountItem,
} from "../controller/account"
import { getReportJournal } from "../controller/report/journal"

const router = Router()

router.route("/journal").get(getJournals)
router.route("/journal/:journalId").get(getJournal)
router.route("/journal").post(createJournal)
router.route("/journal/:journalId").patch(updateJournal)
router.route("/journal/:journalId").delete(deleteJournal)

router.route("/users").get(getUsers)
router.route("/users/:id").get(getUser)
router.route("/users/:id").delete(deleteUser)

router.route("/account").get(getAccountItems)
router.route("/account/:accountItemId").get(getAccountItem)
router.route("/account").post(createAccountItem)
router.route("/account/:accountItemId").patch(updateAccountItem)
router.route("/account/:accountItemId").delete(deleteAccountItem)

router.route("/report/journal").get(getReportJournal)

router.route("/logout").get(logout)

export default router
