import { getAllExpenses } from "@/lib/db";
import ExpenseTracker from "@/components/ExpenseTracker";
import Image from "next/image";

export const metadata = {
  title: "Expense Tracker",
  description: "A polished expense tracker built with Next.js and Tailwind CSS.",
};

export default async function Home() {
  const initialExpenses = getAllExpenses();

  const expenses = initialExpenses.map(exp => ({
    ...exp,
    date: new Date(exp.date).toISOString(),
    createdAt: new Date(exp.createdAt).toISOString(),
  }));

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <section className="mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.9fr_1fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Expense tracker</p>
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">MANAGE YOUR EXPENSES</h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Log personal expenses, filter by category, and remove items instantly with a polished interface that keeps your spending under control.
              </p>
            </div>
            <div className="rounded-[2rem] bg-slate-950/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-white/10">
             
                <Image
                  src="/2.webp"
                  alt="Expense Tracker Icon"
                  width={348}
                  height={348}
                  
                  ></Image>
            </div>
            
          </div>
        </section>

        <ExpenseTracker initialExpenses={expenses} />
      </div>
    </main>
  );
}
