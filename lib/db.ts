import Database from 'better-sqlite3';
import path from 'path';
import type { Expense, Category } from '@/types/expense';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'expenses.db');
    db = new Database(dbPath);
    
    // Enable performance optimizations
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    createTables(db);
  }
  return db;
}

function createTables(db: Database.Database) {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL CHECK(amount > 0),
      category TEXT NOT NULL CHECK(category IN ('food', 'transport', 'utilities', 'other')),
      date TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `;
  
  db.exec(createTableSQL);
  
  // Create index for faster filtering
  db.exec(`CREATE INDEX IF NOT EXISTS idx_category ON expenses(category)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_date ON expenses(date DESC)`);
}

// Helper functions for common operations
export function getAllExpenses(category?: string): Expense[] {
  const db = getDb();
  
  if (category && category !== 'all') {
    const stmt = db.prepare(`
      SELECT * FROM expenses 
      WHERE category = ? 
      ORDER BY date DESC
    `);
    return stmt.all(category) as Expense[];
  } else {
    const stmt = db.prepare(`
      SELECT * FROM expenses 
      ORDER BY date DESC
    `);
    return stmt.all() as Expense[];
  }
}

export function createExpense(expense: Omit<Expense, 'id'>): Expense {
  const db = getDb();
  const { title, amount, category, date, createdAt = new Date().toISOString() } = expense;
  
  const stmt = db.prepare(`
    INSERT INTO expenses (title, amount, category, date, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(title, amount, category, date, createdAt);
  
  const getStmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
  return getStmt.get(result.lastInsertRowid) as Expense;
}

export function deleteExpenseById(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function getExpenseById(id: number): Expense | undefined {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
  return stmt.get(id) as Expense | undefined;
}

export function getTotalSpend(expenses: Expense[]): number {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}