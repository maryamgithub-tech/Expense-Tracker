'use client';

import React from "react";
import { Expense } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  const formatCategory = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          <p className="text-lg font-semibold">No expenses yet</p>
          <p className="mt-2 text-sm">Create your first expense to begin tracking spend.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold text-slate-900">{expense.title}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      {formatCategory(expense.category)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-4">
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Added {new Date(expense.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <p className="text-xl font-semibold text-slate-900">${expense.amount.toFixed(2)}</p>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;