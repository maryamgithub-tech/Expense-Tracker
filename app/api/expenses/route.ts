import { NextRequest, NextResponse } from "next/server";
import { getAllExpenses, createExpense } from "@/lib/db";
import { Category } from "@/types/expense";


type ExpenseCreatePayload = {
  title: string;
  amount: number;
  category: Category;
  date?: string;
  createdAt?: string;
  created_at?: string;
};

// GET api endpoint to fetch expenses, optionally filtered by category

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as Category | null;
    try {
    const expenses = getAllExpenses(category || undefined);
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch expenses", error: (error as Error).message },
      { status: 500 }
    );
  } 
}

// POST /api/expenses - Create a new expense

export async function POST(request: NextRequest) {
    try {
    const body = (await request.json()) as unknown;
    const data = body as ExpenseCreatePayload;
    const { title, amount, category, date = new Date().toISOString() } = data;
    const createdAt = typeof data.createdAt === "string"
      ? data.createdAt
      : typeof data.created_at === "string"
      ? data.created_at
      : new Date().toISOString();

    // Basic validation
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { message: "Invalid title", error: "Title is required and must be a string" },
        { status: 400 }
      );
    }
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount", error: "Amount must be a positive number" },
        { status: 400 }
      );
    }
    if (!category || !["food", "transport", "utilities", "other"].includes(category)) {
        return NextResponse.json(
            { message: "Invalid category", error: "Category must be one of 'food', 'transport', 'utilities', 'other'" },
            { status: 400 }
        );
    }
    if (!date || isNaN(Date.parse(date))) {
        return NextResponse.json(
            { message: "Invalid date", error: "Date must be a valid ISO date string" },
            { status: 400 }
        );
    }
    if (!createdAt || isNaN(Date.parse(createdAt))) {
        return NextResponse.json(
            { message: "Invalid createdAt", error: "createdAt must be a valid ISO date string" },
            { status: 400 }
        );
    }

    const newExpense = createExpense({ title, amount, category, date, createdAt });
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('POST /api/expenses error:', error);
    return NextResponse.json(
      { message: "Failed to create expense", error: (error as Error).message },
      { status: 500 }
    );
  }
}


