'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Expense, Category } from "@/types/expense";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";


type ExpenseTrackerProps = {
  initialExpenses?: Expense[];
};

type CategoryFilter = Category | "all";

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ initialExpenses = [] }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");

  const fetchExpenses = async (selectedCategory: CategoryFilter = "all") => {
    setIsLoading(true);
    try {
      const params = selectedCategory === "all" ? "" : `?category=${selectedCategory}`;
      const response = await fetch(`/api/expenses${params}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalSpend = useMemo(
    () => expenses.reduce((sum, exp) => sum + exp.amount, 0),
    [expenses]
  );

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    setNotification("Expense added successfully.");
    window.setTimeout(() => setNotification(""), 3000);
  };

  const handleDeleteExpense = async (id: number) => {
    const previousExpenses = expenses;
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    setNotification("Deleting expense...");

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setExpenses(previousExpenses);
        const errorData = await response.json();
        setNotification(errorData.message || "Failed to delete expense.");
        window.setTimeout(() => setNotification(""), 4000);
      } else {
        await fetchExpenses(category);
        setNotification("Expense deleted successfully.");
        window.setTimeout(() => setNotification(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      setExpenses(previousExpenses);
      setNotification("Delete failed. Please try again.");
      window.setTimeout(() => setNotification(""), 4000);
    }
  };

  const handleCategoryChange = async (value: CategoryFilter) => {
    setCategory(value);
    await fetchExpenses(value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Expense dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Track spending with confidence</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Use the form below to add expenses, filter by category, and delete items instantly without reloading.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active expenses</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{expenses.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Total spend</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-600">${totalSpend.toFixed(2)}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Filter by category</p>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as CategoryFilter)}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                <option value="all">All</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {notification && (
          <div className="mt-6 rounded-3xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-sm">
            {notification}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <ExpenseForm onAddExpense={handleAddExpense} />
          <div className="rounded-[2rem] overflow-y-auto max-h-100 border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-5 flex items-center justify-between ">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Recent expenses</h3>
                <p className="text-sm text-slate-500">Optimistic delete removes items immediately.</p>
              </div>
              {isLoading && <span className="text-sm text-slate-500">Loading...</span>}
            </div>
            <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Summary</p>
            <p className="mt-4 text-3xl font-semibold">${totalSpend.toFixed(2)}</p>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3">
                <span>Expenses</span>
                <strong>{expenses.length}</strong>
              </div>
              <div className="rounded-3xl bg-white/5 px-4 py-3">
                <p className="text-slate-300">Current filter</p>
                <p className="mt-1 text-base font-semibold text-white">{category === "all" ? "All categories" : category}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Tips</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Use filters to narrow down recent spending.</li>
              <li>Add detailed titles for easier tracking.</li>
              <li>Delete expenses instantly with optimistic updates.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExpenseTracker;

