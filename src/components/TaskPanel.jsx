import { useState, useEffect, useRef } from 'react'

/** Load tasks from localStorage */
const loadTasks = () => {
  try {
    const data = localStorage.getItem('lofocus-tasks')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/**
 * TaskPanel — full CRUD to-do list with inline editing,
 * localStorage persistence, and live progress tracking.
 */
export default function TaskPanel() {
  const [tasks, setTasks] = useState(loadTasks)
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const editRef = useRef(null)

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lofocus-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Auto-focus the edit input when editing starts
  useEffect(() => {
    if (editingId !== null && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editingId])

  /** Add a new task */
  const addTask = () => {
    const text = input.trim()
    if (!text) return
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ])
    setInput('')
  }

  /** Handle Enter key in add input */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask()
  }

  /** Toggle complete / incomplete */
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  /** Start inline editing */
  const startEdit = (task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  /** Save the edited task */
  const saveEdit = (id) => {
    const text = editText.trim()
    if (!text) return cancelEdit()
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t))
    )
    setEditingId(null)
    setEditText('')
  }

  /** Cancel editing */
  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  /** Delete a task */
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (editingId === id) cancelEdit()
  }

  // Progress stats
  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="card flex flex-col gap-6 group h-full" id="task-panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <div>
            <h2 className="font-black text-gray-800 dark:text-gray-100 tracking-tight text-base">Goal Board</h2>
            <p className="text-[9px] text-brand-600 dark:text-brand-400 font-black uppercase tracking-widest">Focus List</p>
          </div>
        </div>
        <span className="badge bg-blue-500/10 text-blue-500">
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Progress</p>
            <span className="text-[9px] font-black text-blue-500 tabular-nums">{percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Add task input */}
      <div className="relative group/input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New goal..."
          className="w-full pl-5 pr-14 py-3.5 rounded-[1.25rem] bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5
                     text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
                     transition-all duration-300"
        />
        <button
          onClick={addTask}
          disabled={!input.trim()}
          className="absolute right-1.5 top-1.5 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center 
                     transition-all duration-300 active:scale-90 disabled:opacity-0 disabled:scale-90 shadow-lg shadow-blue-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Time to focus</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group/task flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 border
                ${task.completed
                  ? 'bg-gray-50/50 dark:bg-white/5 border-transparent opacity-60'
                  : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-blue-500/30'
                }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300
                  ${task.completed
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
              >
                {task.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>

              {editingId === task.id ? (
                <input
                  ref={editRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(task.id)
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  onBlur={() => saveEdit(task.id)}
                  className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => startEdit(task)}
                  className={`flex-1 text-sm font-bold cursor-pointer transition-all duration-300 
                    ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {task.text}
                </span>
              )}

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover/task:opacity-100 p-1.5 text-gray-300 hover:text-rose-500 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
