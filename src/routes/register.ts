import { Router } from "express"
import register from "../controller/register"
const router = Router()

router.route("/register").post(register)

export default router
// const register = router.post(
// 	"/register",
// 	async (req: Request, res: Response) => {
// 		try {
// 			const {
// 				first_name,
// 				last_name,
// 				email,
// 				user_name,
// 				password,
// 				country_code,
// 			} = req.body

// 			if (!first_name || !last_name || !email || !user_name || !password)
// 				return res.status(400).send("Missing fields")

// 			const user = await pool.query(
// 				"SELECT * FROM users WHERE email = $1 OR user_name = $2",
// 				[email, user_name]
// 			)

// 			if (user.rows.length > 0) {
// 				return res.status(400).send("User already exists")
// 			}

// 			const hashedPassword = await bcrypt.hash(password, 10)

// 			const newUser = await pool.query(
// 				"INSERT INTO users (first_name, last_name, email, user_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
// 				[first_name, last_name, email, user_name, hashedPassword]
// 			)
// 			res.send(newUser.rows[0])
// 		} catch (e) {
// 			console.error(e)
// 			res.status(500).send("Server error")
// 		}

// 		// return res.send({ body: req.body })
// 	}
// )
