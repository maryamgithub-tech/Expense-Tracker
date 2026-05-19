
export type Category = "food" | "transport" | "utilities" | "other";

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface NewExpense {
  title: string;
  amount: number;
  category: Category;
  date: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface ApiErrorResponse {
  message: string;
  error: string;
  field?: string;
}
