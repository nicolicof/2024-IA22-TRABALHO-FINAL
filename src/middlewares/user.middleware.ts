import { RequestHandler } from "express"
import { connect } from "../database"
import bcrypt from "bcrypt"

const listUsers: RequestHandler = async (req, res) => {
  const db = await connect()
  const users = await db.all(`SELECT id, name, email FROM users`)
  res.status(200).json(users)
}

const createUser: RequestHandler = async (req, res) => {
  const db = await connect()
  try {
    const { name, email, password } = req.body
    const encryptedPassword = await bcrypt.hash(password, 10)
    const ret = await db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, encryptedPassword])
    res.status(200).json(ret)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const updateUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { id, name, email, password } = req.body
  const encryptedPassword = await bcrypt.hash(password, 10)
  const ret = db.run(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, [name, email, encryptedPassword, id])
  res.status(200).json(ret)
}

const deleteUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { id } = req.body
  const ret = db.run(`DELETE FROM users WHERE id = ?`, [id])
  res.status(200).json(ret)
}

const loginUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { email, password } = req.body
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email])
  if (!user) res.status(404).json({ message: "user n encontrado" })
  const isPass = await bcrypt.compare(password, user.password)
  if (!isPass) res.status(401).json({ message: "senha errada mano" })
  res.status(200).json({ message: "login ok" })
}

const listMovies: RequestHandler = async (req, res) => {
  const db = await connect()
  const filmes = await db.all(`
    SELECT 
      movies.id,
      movies.title,
      movies.duration,
      users.name AS inserted_by_name
    FROM 
      movies
    JOIN 
      users ON movies.inserted_by = users.id
  `)
  res.status(200).json(filmes)
}

// const createComment: RequestHandler = async (req, res) => {
//   const db = await connect()
//   const { movieID, content, userId } = req.body
//   const sendComment = await db.run(`INSERT INTO comments (movie_id, user_id, content) VALUES 
//   (?, ?, ?)`, [movieID, userId, content])
//   res.status(200)
// }

const listComments: RequestHandler = async (req, res) => {
  const db = await connect()
  const { movieId } = req.query
  const comments = await db.all(`
    SELECT 
      comments.id, 
      comments.content, 
      users.name AS user_name, 
      comments.created_at
    FROM 
      comments
    JOIN 
      users ON comments.user_id = users.id
    WHERE 
      comments.movie_id = ?
    ORDER BY 
      comments.created_at DESC
  `, [movieId]);
  res.status(200).json(comments);
}

export default {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  listMovies,
  listComments
}
