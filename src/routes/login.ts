import { Router } from "express"
import login from "../controller/login"

const router = Router()

router.post("/login", login)

export default router
