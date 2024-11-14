import { Router } from "express"
import userMiddleware from "../middlewares/user.middleware"
import { checkToken, createToken } from "../middlewares/jwt.middleware"
const router = Router()
router.get("/list", checkToken, userMiddleware.listUsers)
router.post("/sign", userMiddleware.createUser)
router.get("/movies", checkToken, userMiddleware.listMovies)
// router.post("/comments", checkToken, userMiddleware.createUser)
router.get("/comments", userMiddleware.listComments)
router.put("/update", checkToken, userMiddleware.updateUser)
// router.delete("/delete", checkToken, userMiddleware.deleteUser)
router.post("/login", createToken, userMiddleware.loginUser)
export default router
