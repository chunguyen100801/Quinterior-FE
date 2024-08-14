import sqlite from 'better-sqlite3';
export const db = sqlite('main.db');

const createUserTableSQL = `
    CREATE TABLE IF NOT EXISTS user (
        id TEXT PRIMARY KEY,
        accessToken TEXT NOT NULL,
        refreshToken TEXT NOT NULL
    )
`;
// Execute the SQL statement to create the table
db.exec(createUserTableSQL);

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);
