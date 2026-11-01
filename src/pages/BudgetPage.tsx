import React, { useState } from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  DollarSign,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  CreditCard,
  TrendingDown,
  Info,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { Expense } from '../types';
import { formatCurrency } from '../utils/formatters';

const CHART_COLORS = ['#E05368', '#9C88FF', '#D4AF37', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const BudgetPage: React.FC = () => {
  const { activeEvent, updateEvent, addExpense, updateExpense, deleteExpense } = useEventContext();

  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form states for new/edited expense
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategoryId, setExpenseCategoryId] = useState('');
  const [expenseEstimated, setExpenseEstimated] = useState(0);
  const [expenseActual, setExpenseActual] = useState(0);
  const [expenseIsPaid, setExpenseIsPaid] = useState(false);
  const [expenseNotes, setExpenseNotes] = useState('');

  // Overall Budget quick edit
  const [isEditingTotalBudget, setIsEditingTotalBudget] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState(activeEvent?.totalBudget || 50000);

  if (!activeEvent) {
    return <div className="p-8 text-center text-stone-500">Please select an event.</div>;
  }

  // --- Accurate Budget Calculations ---
  const totalBudget = activeEvent.totalBudget;
  
  // Total actual spent: only counts actualCost of paid expenses, or recorded actual cost
  const totalPaidSpent = activeEvent.expenses
    .filter((e) => e.isPaid)
    .reduce((sum, e) => sum + (e.actualCost || 0), 0);

  // Total committed/estimated expenses
  const totalCommitted = activeEvent.expenses.reduce(
    (sum, e) => sum + (e.isPaid ? e.actualCost : e.estimatedCost || 0),
    0
  );

  const remainingBudget = totalBudget - totalPaidSpent;
  const utilizationPct = totalBudget > 0 ? Math.round((totalPaidSpent / totalBudget) * 100) : 0;
  const committedUtilizationPct = totalBudget > 0 ? Math.round((totalCommitted / totalBudget) * 100) : 0;

  // Chart data: category-level planned vs actual
  const categoryComparisonData = activeEvent.categories.map((cat) => {
    const catExpenses = activeEvent.expenses.filter((e) => e.categoryId === cat.id);
    const catActualPaid = catExpenses
      .filter((e) => e.isPaid)
      .reduce((s, e) => s + (e.actualCost || 0), 0);
    const catCommitted = catExpenses.reduce(
      (s, e) => s + (e.isPaid ? e.actualCost : e.estimatedCost || 0),
      0
    );

    return {
      name: cat.name.split(' ')[0], // short name for chart
      fullName: cat.name,
      allocated: cat.allocatedAmount,
      spent: catActualPaid,
      committed: catCommitted,
    };
  });

  const pieData = activeEvent.categories.map((cat) => ({
    name: cat.name,
    value: cat.allocatedAmount,
  }));

  const handleOpenAddModal = (catId?: string) => {
    setEditingExpense(null);
    setExpenseTitle('');
    setExpenseCategoryId(catId || activeEvent.categories[0]?.id || '');
    setExpenseEstimated(5000);
    setExpenseActual(0);
    setExpenseIsPaid(false);
    setExpenseNotes('');
    setIsAddExpenseModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseTitle(expense.title);
    setExpenseCategoryId(expense.categoryId);
    setExpenseEstimated(expense.estimatedCost);
    setExpenseActual(expense.actualCost);
    setExpenseIsPaid(expense.isPaid);
    setExpenseNotes(expense.notes || '');
    setIsAddExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim()) return;

    if (editingExpense) {
      updateExpense({
        ...editingExpense,
        title: expenseTitle,
        categoryId: expenseCategoryId,
        estimatedCost: Number(expenseEstimated),
        actualCost: Number(expenseActual),
        isPaid: expenseIsPaid,
        paidDate: expenseIsPaid ? editingExpense.paidDate || new Date().toISOString() : undefined,
        notes: expenseNotes,
      });
    } else {
      addExpense({
        title: expenseTitle,
        categoryId: expenseCategoryId,
        estimatedCost: Number(expenseEstimated),
        actualCost: Number(expenseActual),
        isPaid: expenseIsPaid,
        paidDate: expenseIsPaid ? new Date().toISOString() : undefined,
        notes: expenseNotes,
      });
    }

    setIsAddExpenseModalOpen(false);
  };

  const handleSaveTotalBudget = () => {
    if (newTotalBudget > 0) {
      updateEvent({
        ...activeEvent,
        totalBudget: newTotalBudget,
      });
      setIsEditingTotalBudget(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
            <DollarSign className="w-4 h-4" />
            Financial Management & Expense Tracking
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">
            Event Budget: {activeEvent.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time tracking of allocations, confirmed vendor line-items, and remaining cash buffer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-md shadow-[#E05368]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Expense Line-Item
          </button>
        </div>
      </div>

      {/* Warnings & Alerts */}
      {totalPaidSpent > totalBudget && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Over Budget Alert!</strong>
            Actual payments ({formatCurrency(totalPaidSpent, activeEvent.currency)}) exceed your total planned budget of {formatCurrency(totalBudget, activeEvent.currency)} by {formatCurrency(totalPaidSpent - totalBudget, activeEvent.currency)}.
          </div>
        </div>
      )}

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            <button
              onClick={() => {
                setNewTotalBudget(activeEvent.totalBudget);
                setIsEditingTotalBudget(true);
              }}
              className="text-xs text-[#E05368] font-semibold hover:underline"
            >
              Edit
            </button>
          </div>
          {isEditingTotalBudget ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                aria-label="Total budget cap amount"
                value={newTotalBudget}
                onChange={(e) => setNewTotalBudget(Number(e.target.value))}
                className="w-full px-2 py-1 text-sm font-bold border border-[#E05368] rounded-lg"
              />
              <button
                onClick={handleSaveTotalBudget}
                className="px-2 py-1 bg-[#E05368] text-white rounded-lg text-xs font-bold"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#2D1236]">
                {formatCurrency(totalBudget, activeEvent.currency)}
              </span>
              <span className="block text-[11px] text-stone-500 font-medium">100% Target Cap</span>
            </div>
          )}
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Actually Paid</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700">
              {formatCurrency(totalPaidSpent, activeEvent.currency)}
            </span>
            <span className="block text-[11px] text-stone-500 font-medium">
              {utilizationPct}% utilized out of total
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Committed</span>
            <CreditCard className="w-4 h-4 text-[#9C88FF]" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-[#2D1236]">
              {formatCurrency(totalCommitted, activeEvent.currency)}
            </span>
            <span className="block text-[11px] text-stone-500 font-medium">
              {committedUtilizationPct}% incl. pending quotes
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold uppercase tracking-wider">Remaining Buffer</span>
            <TrendingDown className={`w-4 h-4 ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
          </div>
          <div>
            <span className={`text-2xl sm:text-3xl font-bold ${remainingBudget < 0 ? 'text-rose-600' : 'text-[#2D1236]'}`}>
              {formatCurrency(remainingBudget, activeEvent.currency)}
            </span>
            <span className="block text-[11px] text-stone-500 font-medium">
              {remainingBudget >= 0 ? 'Safe remaining funds' : 'Deficit / Overdraft'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section: Pie Allocation + Bar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Budget Allocation Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#2D1236]">Category Budget Distribution</h3>
            <span className="text-xs text-stone-400 font-mono">100% Proportions</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) => [formatCurrency(Number(value), activeEvent.currency), 'Allocated']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5', fontSize: '12px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
            {activeEvent.categories.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-stone-600 truncate">{c.name}:</span>
                <strong className="text-[#2D1236] shrink-0">{formatCurrency(c.allocatedAmount, activeEvent.currency)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Planned vs Actual Bar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#2D1236]">Allocated vs. Paid by Category</h3>
            <span className="text-xs text-stone-400 font-mono">Real-time Spend</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#78716c' }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#78716c' }} tickFormatter={(val) => `${val >= 1000 ? `${val / 1000}k` : val}`} />
                <Tooltip
                  formatter={(val: unknown) => [formatCurrency(Number(val), activeEvent.currency)]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="allocated" name="Allocated Budget" fill="#E05368" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spent" name="Actually Paid" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 text-xs text-stone-500 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#E05368] shrink-0" />
            <span>Green bars represent money actually cleared and paid. Unpaid quotes do not reduce your actual balance.</span>
          </div>
        </div>
      </div>

      {/* Category Breakdowns & Expense Line-Items Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2D1236]">Itemized Expense Register</h3>
            <p className="text-xs text-stone-500">Record deposits, track vendor invoices, and toggle payment clearance.</p>
          </div>
          <button
            onClick={() => handleOpenAddModal()}
            className="text-xs font-semibold text-[#E05368] hover:underline"
          >
            + Add New Expense
          </button>
        </div>

        {activeEvent.categories.map((cat) => {
          const catExpenses = activeEvent.expenses.filter((e) => e.categoryId === cat.id);
          const catPaid = catExpenses.filter((e) => e.isPaid).reduce((s, e) => s + (e.actualCost || 0), 0);
          const isOver = catPaid > cat.allocatedAmount;

          return (
            <div key={cat.id} className="border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-3 bg-[#FAF8F5]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-serif font-bold text-base text-[#2D1236]">{cat.name}</span>
                  <span className="text-xs text-stone-400 font-mono">
                    Allocated: {formatCurrency(cat.allocatedAmount, activeEvent.currency)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${isOver ? 'text-rose-600' : 'text-emerald-700'}`}>
                    Paid: {formatCurrency(catPaid, activeEvent.currency)}
                  </span>
                  <button
                    onClick={() => handleOpenAddModal(cat.id)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-[#2D1236] hover:bg-stone-50"
                  >
                    + Add to {cat.name.split(' ')[0]}
                  </button>
                </div>
              </div>

              {catExpenses.length === 0 ? (
                <div className="py-3 text-center text-xs text-stone-400 italic">
                  No line-items added yet for this category.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-stone-400 uppercase font-mono border-b border-stone-200/40">
                        <th className="py-2">Item Title</th>
                        <th className="py-2">Estimated</th>
                        <th className="py-2">Actual Cost</th>
                        <th className="py-2">Payment Status</th>
                        <th className="py-2">Notes</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/40">
                      {catExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-white/60 transition-colors">
                          <td className="py-2.5 font-semibold text-[#2D1236]">{exp.title}</td>
                          <td className="py-2.5 text-stone-600">{formatCurrency(exp.estimatedCost, activeEvent.currency)}</td>
                          <td className="py-2.5 font-bold text-[#2D1236]">
                            {exp.actualCost ? formatCurrency(exp.actualCost, activeEvent.currency) : '—'}
                          </td>
                          <td className="py-2.5">
                            <button
                              onClick={() => {
                                updateExpense({
                                  ...exp,
                                  isPaid: !exp.isPaid,
                                  paidDate: !exp.isPaid ? new Date().toISOString() : undefined,
                                });
                              }}
                              aria-label={`Toggle payment for ${exp.title}, currently ${exp.isPaid ? 'paid' : 'unpaid'}`}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                exp.isPaid
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            >
                              {exp.isPaid ? 'PAID ✓' : 'UNPAID'}
                            </button>
                          </td>
                          <td className="py-2.5 text-stone-500 max-w-xs truncate">{exp.notes || '—'}</td>
                          <td className="py-2.5 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditModal(exp)}
                              className="text-stone-400 hover:text-[#2D1236]"
                              title="Edit"
                              aria-label={`Edit expense ${exp.title}`}
                            >
                              <Edit2 className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => deleteExpense(exp.id)}
                              className="text-stone-400 hover:text-rose-600"
                              title="Delete"
                              aria-label={`Delete expense ${exp.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Expense Modal */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">
                {editingExpense ? 'Edit Expense Item' : 'Add Expense Item'}
              </h3>
              <button
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="text-stone-400 hover:text-[#2D1236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Venue advance deposit or Photographer booking"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#E05368]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Category *</label>
                <select
                  value={expenseCategoryId}
                  onChange={(e) => setExpenseCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none bg-white focus:border-[#E05368]"
                >
                  {activeEvent.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Estimated Quote</label>
                  <input
                    type="number"
                    min="0"
                    value={expenseEstimated}
                    onChange={(e) => setExpenseEstimated(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Actual Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={expenseActual}
                    onChange={(e) => setExpenseActual(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isPaidCheck"
                  checked={expenseIsPaid}
                  onChange={(e) => setExpenseIsPaid(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E05368] focus:ring-[#E05368]"
                />
                <label htmlFor="isPaidCheck" className="text-xs font-semibold text-stone-700 cursor-pointer">
                  Mark as fully paid / cleared transaction
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Notes & Payment Details</label>
                <textarea
                  placeholder="e.g. Cleared via RTGS, receipt #4928"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none resize-none h-16"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56]"
                >
                  {editingExpense ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
