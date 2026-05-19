import { NextRequest, NextResponse } from "next/server";
import { deleteExpenseById, getExpenseById } from "@/lib/db";


// DELETE /api/expenses/:id - Delete an expense by ID

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
    const resolvedParams = await params;
    const idString = resolvedParams.id ?? new URL(request.url).pathname.split('/').filter(Boolean).pop();
    const id = parseInt(idString ?? '', 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid ID", error: "ID must be a valid number" },
        { status: 400 }
      );
    }
    const existingExpense = getExpenseById(id);
    if (!existingExpense) {
      return NextResponse.json(
        { message: "Expense not found", error: `No expense found with ID ${id}` },
        { status: 404 }
      );
    }
    const success = deleteExpenseById(id);
    if (success) {
      return NextResponse.json({ message: "Expense deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "Failed to delete expense", error: "Unknown error occurred" },
        { status: 500 }
      );
    }
    } catch (error) {
        console.error('DELETE /api/expenses/:id error:', error);
        return NextResponse.json(
          { message: "Failed to delete expense", error: (error as Error).message },
          { status: 500 }
        );
    }
}
