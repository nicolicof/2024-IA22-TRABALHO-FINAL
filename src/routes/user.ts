import { Router } from "express"
import userMiddleware from "../middlewares/user.middleware"
import { checkToken, decodeToken } from "../middlewares/jwt.middleware"
const router = Router()
router.post("/sign", userMiddleware.createUser)
router.get("/movies", checkToken, userMiddleware.listMovies)
router.post("/comments", decodeToken, userMiddleware.createComment)
router.get("/comments", checkToken, userMiddleware.listComments)
router.post("/perfil", decodeToken, userMiddleware.mostrarDados)
router.put("/upname", decodeToken, userMiddleware.updateName)
router.put("/uppass", decodeToken, userMiddleware.updatePassword)
router.delete("/delete", decodeToken, userMiddleware.deleteUser)
export default router
