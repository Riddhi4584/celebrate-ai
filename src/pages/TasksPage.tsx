import React, { useState } from 'react';
import {
  ListTodo,
  PlusCircle,
  Calendar,
  Trash2,
  Edit2,
  Check,
  X,
  User,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { Task } from '../types';
import { formatDate, getDaysRemaining } from '../utils/formatters';

export const TasksPage: React.FC = () => {
  const { activeEvent, addTask, updateTask, deleteTask, toggleTaskComplete } = useEventContext();

  const [viewMode, setViewMode] = useState<'checklist' | 'timeline'>('checklist');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Task Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [taskCategory, setTaskCategory] = useState('Planning');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [taskPhase, setTaskPhase] = useState<Task['phase']>('preparation');

  if (!activeEvent) {
    return <div className="p-8 text-center text-stone-500">Please select an event.</div>;
  }

  const tasks = activeEvent.tasks;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.length - completedCount;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const overdueCount = tasks.filter((t) => {
    if (t.isCompleted || !t.dueDate) return false;
    const days = getDaysRemaining(t.dueDate);
    return days.isPast;
  }).length;

  // Filter & Search Logic
  const filteredTasks = tasks.filter((t) => {
    // Status filter
    if (filterStatus === 'pending' && t.isCompleted) return false;
    if (filterStatus === 'completed' && !t.isCompleted) return false;
    if (filterStatus === 'overdue') {
      const days = getDaysRemaining(t.dueDate);
      if (t.isCompleted || !days.isPast) return false;
    }

    // Priority filter
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // Sort by deadline
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskDueDate(activeEvent.date);
    setTaskPriority('high');
    setTaskCategory('General Coordination');
    setTaskAssignedTo('');
    setTaskPhase('preparation');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: Task) => {
    setEditingTask(t);
    setTaskTitle(t.title);
    setTaskDesc(t.description);
    setTaskDueDate(t.dueDate);
    setTaskPriority(t.priority);
    setTaskCategory(t.category);
    setTaskAssignedTo(t.assignedTo || '');
    setTaskPhase(t.phase || 'preparation');
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDueDate,
        priority: taskPriority,
        category: taskCategory,
        assignedTo: taskAssignedTo,
        phase: taskPhase,
      });
    } else {
      addTask({
        title: taskTitle,
        description: taskDesc,
        dueDate: taskDueDate,
        priority: taskPriority,
        category: taskCategory,
        isCompleted: false,
        assignedTo: taskAssignedTo,
        phase: taskPhase,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
            <ListTodo className="w-4 h-4" />
            Milestone Timeline & Checklist Management
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">
            Tasks & Deadlines: {activeEvent.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {completedCount} of {tasks.length} tasks completed ({completionPct}% complete).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-md shadow-[#E05368]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Milestone Task
          </button>
        </div>
      </div>

      {/* Progress & KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Tasks</span>
          <span className="text-2xl font-bold text-[#2D1236] block">{tasks.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Completed</span>
          <span className="text-2xl font-bold text-emerald-700 block">{completedCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending</span>
          <span className="text-2xl font-bold text-amber-700 block">{pendingCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Overdue</span>
          <span className="text-2xl font-bold text-rose-700 block">{overdueCount}</span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-2">
        <div className="flex justify-between text-xs font-semibold text-stone-700">
          <span>Overall Planning Progress</span>
          <span className="text-[#E05368] font-bold">{completionPct}%</span>
        </div>
        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#E05368] to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Controls: Search, Filters & View Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          {(['all', 'pending', 'completed', 'overdue'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-[#2D1236] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-stone-600 hover:bg-stone-100 border border-stone-200/60'
              }`}
            >
              {st} {st === 'overdue' && overdueCount > 0 ? `(${overdueCount})` : ''}
            </button>
          ))}

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 bg-[#FAF8F5] text-stone-700 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search tasks by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-stone-200 focus:border-[#E05368] outline-none w-52"
          />

          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-stone-100 p-0.5 border border-stone-200">
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'checklist' ? 'bg-white shadow-xs text-[#2D1236]' : 'text-stone-500 hover:text-[#2D1236]'
              }`}
            >
              Checklist
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline' ? 'bg-white shadow-xs text-[#2D1236]' : 'text-stone-500 hover:text-[#2D1236]'
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Main Task List */}
      {viewMode === 'checklist' ? (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-3">
          {sortedTasks.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs italic">
              No tasks match your current filter criteria.
            </div>
          ) : (
            sortedTasks.map((task) => {
              const days = getDaysRemaining(task.dueDate);
              const isOverdue = !task.isCompleted && days.isPast;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    task.isCompleted
                      ? 'bg-stone-50/60 border-stone-200/60 opacity-75'
                      : isOverdue
                      ? 'bg-rose-50/30 border-rose-200'
                      : 'bg-[#FAF8F5] border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      aria-label={`Mark task ${task.title} as ${task.isCompleted ? 'incomplete' : 'completed'}`}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        task.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 hover:border-[#E05368] bg-white text-transparent hover:text-stone-200'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-serif font-bold text-sm sm:text-base ${
                            task.isCompleted ? 'line-through text-stone-400' : 'text-[#2D1236]'
                          }`}
                        >
                          {task.title}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : task.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {task.category && (
                          <span className="text-[10px] font-medium text-stone-400 uppercase font-mono">
                            • {task.category}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-stone-600 leading-relaxed font-normal">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-stone-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          Due: <strong className="text-stone-700">{formatDate(task.dueDate)}</strong>
                        </span>

                        {task.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            {task.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        task.isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-stone-200/70 text-stone-700'
                      }`}
                    >
                      {task.isCompleted ? 'COMPLETED' : isOverdue ? 'OVERDUE' : days.label}
                    </span>

                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="text-stone-400 hover:text-[#2D1236] p-1"
                      title="Edit Task"
                      aria-label={`Edit task ${task.title}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Delete Task"
                      aria-label={`Delete task ${task.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Timeline Phase Grouped View */
        <div className="space-y-6">
          {[
            { phase: 'early_planning', label: 'Phase 1: Early Foundation & Venue Locking' },
            { phase: 'booking', label: 'Phase 2: Core Vendor Tastings & Contracts' },
            { phase: 'preparation', label: 'Phase 3: Invitations & Detail Styling' },
            { phase: 'final_week', label: 'Phase 4: Final Week Coordination & Rehearsals' },
            { phase: 'event_day', label: 'Phase 5: Event Day Execution & Logistics' },
          ].map((grp) => {
            const phaseTasks = sortedTasks.filter((t) => (t.phase || 'preparation') === grp.phase);
            if (phaseTasks.length === 0) return null;

            return (
              <div key={grp.phase} className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs space-y-4">
                <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#2D1236]">{grp.label}</h3>
                  <span className="text-xs text-stone-400 font-mono">{phaseTasks.length} Milestones</span>
                </div>

                <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-4 before:w-0.5 before:bg-stone-200">
                  {phaseTasks.map((t) => (
                    <div key={t.id} className="relative pl-10">
                      <div
                        className={`absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                          t.isCompleted ? 'bg-emerald-500' : 'bg-[#E05368]'
                        }`}
                      />
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex items-center justify-between">
                        <div>
                          <span className={`text-sm font-semibold block ${t.isCompleted ? 'line-through text-stone-400' : 'text-[#2D1236]'}`}>
                            {t.title}
                          </span>
                          <span className="text-xs text-stone-500">
                            Due {formatDate(t.dueDate)} • {t.priority.toUpperCase()}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleTaskComplete(t.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                            t.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 hover:bg-stone-300'
                          }`}
                        >
                          {t.isCompleted ? 'Done ✓' : 'Mark Done'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">
                {editingTask ? 'Edit Task' : 'Add Milestone Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-[#2D1236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule floral centerpiece mock-up review"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#E05368]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Description</label>
                <textarea
                  placeholder="Specific actions or questions to ask..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none resize-none h-16"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none bg-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Catering, Venue, Styling"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Assigned To</label>
                  <input
                    type="text"
                    placeholder="e.g. Maya, Groom, Event Lead"
                    value={taskAssignedTo}
                    onChange={(e) => setTaskAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56]"
                >
                  {editingTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
