import express, { Router } from "express"
import path from "path"
const router = Router()
router.use(express.static(path.join(__dirname, "/../../public")));
router.get("/filmes", (req, res) => { res.sendFile(path.join(__dirname, "../../public/acesso-privado.html")) })
router.get("/filmes.html", (req, res) => { res.redirect("/filmes") })
router.get("/acesso-privado.html", (req, res) => { res.redirect("/filmes") })
export default router
