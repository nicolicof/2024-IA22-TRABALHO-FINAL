import { RequestHandler } from "express"
import { connect } from "../database"
import bcrypt from "bcrypt"

const mostrarDados: RequestHandler = async (req, res) => {
  const db = await connect()
  try {
    const id = res.locals.user.id
    const ret = await db.get(`SELECT name, email FROM users WHERE id = ?`, [id])
    res.status(200).json(ret)
  } catch (error) {
    res.status(400).json({ error })
  }
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

const updatePassword: RequestHandler = async (req, res) => {
  const db = await connect()
  const userId = res.locals.user.id
  const { novaSenha, senhaAntiga } = req.body
  const user = await db.get('SELECT * FROM users WHERE id = ?', [userId])
  if (!user) res.status(404).json({ error: 'Usuário não encontrado' })
  const passwordMatch = await bcrypt.compare(senhaAntiga, user.password)
  if (!passwordMatch) res.status(400).json({ error: 'Senha antiga incorreta' })
  const encryptedPassword = await bcrypt.hash(novaSenha, 10)
  const result = await db.run(`UPDATE users SET password = ? WHERE id = ?`, [encryptedPassword, userId])
  if (result.changes === 0) res.status(404).json({ error: 'Nenhuma alteração de senha realizada' })
  res.status(200).json({ message: 'Senha atualizada com sucesso' })
}

const updateName: RequestHandler = async (req, res) => {
  const db = await connect()
  const id = res.locals.user.id
  const { newName, password } = req.body

  // Verifique se o novo nome e a senha foram fornecidos
  if (!newName || !password) {
    res.status(400).json({ error: "Nome ou senha não fornecidos" })
  }

  // Pegue o usuário no banco de dados
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id])

  // Verifique se o usuário existe
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" })
  }

  // Compare a senha fornecida com a senha no banco de dados
  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  // Se a senha estiver incorreta, retorne um erro
  if (!isPasswordCorrect) {
    res.status(401).json({ error: "Senha incorreta" })
  }

  // Atualize o nome no banco de dados
  await db.run(`UPDATE users SET name = ? WHERE id = ?`, [newName, id])

  // Retorne uma resposta de sucesso
  res.status(200).json({ message: 'Nome atualizado com sucesso' })
}


const deleteUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const id = res.locals.user.id
  const ret = db.run(`DELETE FROM users WHERE id = ?`, [id])
  res.status(200).json(ret)
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

const createComment: RequestHandler = async (req, res) => {
  const db = await connect()
  const userId = res.locals.user.id
  const { movieID, content } = req.body

  try {
    const x = await db.run(`INSERT INTO comments (movie_id, user_id, content) VALUES (?, ?, ?)`, [movieID, userId, content])
    res.status(200).json(x)
  } catch (error) {
    res.status(400).json({ error: "Falha ao criar comentário" })
  }
}

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
  createUser,
  updatePassword,
  updateName,
  deleteUser,
  listMovies,
  listComments,
  createComment,
  mostrarDados
}
