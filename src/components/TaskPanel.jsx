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
    <div className="card flex flex-col gap-8 group" id="task-panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-gray-100 tracking-tight text-lg">Task Board</h2>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Stay Organized</p>
          </div>
        </div>
        <span className="badge bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Daily Progress</p>
            <span className="text-[10px] font-black text-blue-500 tabular-nums">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800/50 rounded-full overflow-hidden p-0.5 border border-gray-100/50 dark:border-gray-800/30">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
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
          placeholder="What needs to be done?"
          className="w-full pl-5 pr-14 py-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/50
                     text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 dark:focus:border-blue-500/50
                     transition-all duration-300"
          id="task-input"
        />
        <button
          onClick={addTask}
          disabled={!input.trim()}
          className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center 
                     transition-all duration-300 active:scale-90 disabled:opacity-0 disabled:scale-90 shadow-lg shadow-blue-500/20"
          id="task-add-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-3 min-h-[200px] max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-center opacity-40">
            <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">All clear for now</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group/task flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${task.completed
                  ? 'bg-gray-50/50 dark:bg-gray-800/10 opacity-70'
                  : 'bg-white dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                } border border-gray-100 dark:border-gray-800/50 shadow-sm hover:shadow-md`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-500
                  ${task.completed
                    ? 'bg-blue-500 border-blue-500 text-white scale-110'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                id={`task-toggle-${task.id}`}
              >
                {task.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>

              {/* Task text or edit input */}
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
                  className="flex-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800
                             text-sm text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => startEdit(task)}
                  className={`flex-1 text-sm font-medium cursor-pointer transition-all duration-300 
                    ${task.completed
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-700 dark:text-gray-200'
                    }`}
                >
                  {task.text}
                </span>
              )}

              {/* Delete button */}
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover/task:opacity-100 p-2 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 
                           dark:hover:bg-rose-900/20 transition-all duration-300"
                id={`task-delete-${task.id}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
