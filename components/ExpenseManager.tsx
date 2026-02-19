import React, { useState } from 'react';
import { Card } from './ui/Card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Trash2, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../locale';

const data = [
  { name: 'Salaries', value: 900000 },
  { name: 'Maintenance', value: 270000 },
  { name: 'Utilities', value: 144000 },
  { name: 'Events', value: 216000 },
];

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981'];

const INITIAL_EXPENSES = [
  { id: 1, title: 'Lab Equipment Purchase', date: '24 Oct 2023', amount: 22500.00 },
  { id: 2, title: 'Library Books Acquisition', date: '22 Oct 2023', amount: 8100.00 },
  { id: 3, title: 'Sports Day Logistics', date: '20 Oct 2023', amount: 57600.00 },
  { id: 4, title: 'Annual Building Maintenance', date: '15 Oct 2023', amount: 27000.00 },
  { id: 5, title: 'Staff Room Stationery', date: '10 Oct 2023', amount: 4500.00 },
];

export const ExpenseManager: React.FC = () => {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this expense record?")) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Expense Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Expense Breakdown">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Expenses">
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                    <TrendingDown size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{expense.title}</h4>
                    <p className="text-xs text-slate-500">{expense.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-700">-{formatCurrency(expense.amount)}</span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && <p className="text-center text-slate-400 py-4">No recent expenses.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};