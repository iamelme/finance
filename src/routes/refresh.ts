import { Router } from "express"
import refreshToken from "../controller/refreshToken"

const router = Router()

router.route("/refresh").get(refreshToken)

export default router
