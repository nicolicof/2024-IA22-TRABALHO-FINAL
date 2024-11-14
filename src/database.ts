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

  await db.exec('PRAGMA busy_timeout = 5000')

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
      parent_comment_id INTEGER,
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (parent_comment_id) REFERENCES comments(id)
    )
  `)

  const password = await bcrypt.hash('123123', 10)
  await db.exec(`
    INSERT OR REPLACE INTO users (id, name, email, password) 
    VALUES (1, 'Susan Bar', 'susan@mail.com', '${password}')
  `)

  await db.exec(`
    INSERT OR IGNORE INTO movies (title, duration, inserted_by) VALUES 
      ('Inception', 148, 1),
      ('The Matrix', 136, 1),
      ('Interstellar', 169, 1)
  `)

  await db.exec(`
    INSERT INTO comments (movie_id, user_id, content) VALUES 
      (1, 1, 'Amazing movie, so many layers to think about!')
  `)

  await db.exec(`
    INSERT INTO comments (movie_id, user_id, content, parent_comment_id) VALUES 
      (1, 1, 'I totally agree with myself. Each watch reveals something new!', 1)
  `)

  await db.exec(`
    INSERT INTO comments (movie_id, user_id, content) VALUES 
      (2, 1, 'The Matrix is a timeless classic!')
  `)

  await db.exec(`
    INSERT INTO comments (movie_id, user_id, content, parent_comment_id) VALUES 
      (2, 1, 'Can’t believe how relevant it still is today!', 2)
  `)

  await db.exec(`
    INSERT INTO comments (movie_id, user_id, content) VALUES 
      (3, 1, 'Interstellar blew my mind with its science and visuals.')
  `)

  await db.exec(`
    INSERT INTO comments (movie_id, user_id, content, parent_comment_id) VALUES 
      (3, 1, 'The black hole scene was unforgettable!', 3)
  `)

  instance = db
  return db
}
