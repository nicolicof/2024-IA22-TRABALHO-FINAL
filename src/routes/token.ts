import { Router } from "express"
import jwtMiddleware from "../middlewares/jwt.middleware"
const router = Router()
router.post("/create", jwtMiddleware.createToken)
router.post("/verify", jwtMiddleware.checkToken)
router.post("/refresh", jwtMiddleware.refreshToken)
router.post("/decode", jwtMiddleware.decodeToken)
export default router
