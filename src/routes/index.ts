import { Router } from "express"
import staticRouter from "./static"
// import tokenRouter from "./token"
const router = Router()
router.use("/", staticRouter)
// router.post("/token", tokenRouter)
export default router