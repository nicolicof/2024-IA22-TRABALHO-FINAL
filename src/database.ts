import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'

let instance: Database | null = null

export async function connect() {
  if (instance) return instance

  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      duration INTEGER,
      inserted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      inserted_by INTEGER,
      FOREIGN KEY (inserted_by) REFERENCES users(id),
      UNIQUE (title, duration)
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER,
      user_id INTEGER,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (movie_id, user_id, content)
    )
  `)

  const password = await bcrypt.hash('123123', 10)
  await db.exec(`
    INSERT OR REPLACE INTO users (id, name, email, password) 
    VALUES (1, 'Susan Bar', 'susan@mail.com', '${password}')
  `)

  await db.exec(`
    INSERT OR REPLACE INTO movies (title, duration, inserted_by) VALUES 
      ('A Origem', 228, 1),
      ('Matrix', 216, 1),
      ('Interestelar', 249, 1)
  `)

  await db.exec(`
    INSERT OR REPLACE INTO comments (movie_id, user_id, content) VALUES 
      (1, 1, 'filme ruim da peste'),
      (2, 1, 'o Neo não sabe typescript'),
      (3, 1, 'a terra é plana gente, só aceita')
  `);


  instance = db
  return db
}
