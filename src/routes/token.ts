import { Router } from "express"
const router = Router()
router.post("/", (req, res) => { res.status(501).send("Not Implemented") })
router.post("/verify", (req, res) => { res.status(501).send("Not Implemented") })
router.post("/refresh",  (req, res) => { res.status(501).send("Not Implemented") })
export default router