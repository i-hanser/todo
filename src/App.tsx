import { useState, useEffect, useRef } from 'react'
import './App.css'

const STORAGE_KEY = 'todo-list-app'

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  deadline?: string // 截止日期，格式：YYYY-MM-DD
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'title' | 'description' | 'deadline' | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editingDeadline, setEditingDeadline] = useState('')
  const [completedCollapsed, setCompletedCollapsed] = useState(true) 
  const isInitialized = useRef(false) // 标记是否已初始化完成

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY)
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos)
        if (Array.isArray(parsedTodos)) {
          setTodos(parsedTodos)
        }
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    }
    // 加载折叠状态
    const savedCollapsed = localStorage.getItem(`${STORAGE_KEY}-collapsed`)
    if (savedCollapsed !== null) {
      setCompletedCollapsed(savedCollapsed === 'true')
    }
    // 使用 setTimeout 确保 setTodos 的状态更新完成后再标记初始化完成
    setTimeout(() => {
      isInitialized.current = true
    }, 100)
  }, [])

  // 保存数据到 localStorage（跳过初始化阶段）
  useEffect(() => {
    // 只在初始化完成后才保存，避免初始化时覆盖数据
    if (isInitialized.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
  }, [todos])

  // 保存折叠状态到 localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-collapsed`, String(completedCollapsed))
  }, [completedCollapsed])

  // 添加待办事项
  const handleAdd = () => {
    if (title.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        completed: false
      }
      setTodos([...todos, newTodo])
      setTitle('')
      setDescription('')
      setDeadline('')
    }
  }

  // 开始编辑标题
  const handleStartEditTitle = (todo: Todo) => {
    if (editingId && editingId !== todo.id) {
      if (editingField === 'title') {
        handleSaveTitle(editingId)
      } else if (editingField === 'description') {
        handleSaveDescription(editingId)
      } else if (editingField === 'deadline') {
        handleSaveDeadline(editingId)
      }
    }
    setEditingId(todo.id)
    setEditingField('title')
    setEditingTitle(todo.title)
  }

  // 开始编辑描述
  const handleStartEditDescription = (todo: Todo) => {
    if (editingId && editingId !== todo.id) {
      if (editingField === 'title') {
        handleSaveTitle(editingId)
      } else if (editingField === 'description') {
        handleSaveDescription(editingId)
      } else if (editingField === 'deadline') {
        handleSaveDeadline(editingId)
      }
    }
    setEditingId(todo.id)
    setEditingField('description')
    setEditingDescription(todo.description || '')
  }

  // 开始编辑日期
  const handleStartEditDeadline = (todo: Todo) => {
    if (editingId && editingId !== todo.id) {
      if (editingField === 'title') {
        handleSaveTitle(editingId)
      } else if (editingField === 'description') {
        handleSaveDescription(editingId)
      } else if (editingField === 'deadline') {
        handleSaveDeadline(editingId)
      }
    }
    setEditingId(todo.id)
    setEditingField('deadline')
    setEditingDeadline(todo.deadline || '')
  }

  // 保存标题
  const handleSaveTitle = (id: string) => {
    if (editingTitle.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, title: editingTitle.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditingField(null)
    setEditingTitle('')
  }

  // 保存描述
  const handleSaveDescription = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, description: editingDescription.trim() || undefined }
        : todo
    ))
    setEditingId(null)
    setEditingField(null)
    setEditingDescription('')
  }

  // 保存日期
  const handleSaveDeadline = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, deadline: editingDeadline || undefined }
        : todo
    ))
    setEditingId(null)
    setEditingField(null)
    setEditingDeadline('')
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingField(null)
    setEditingTitle('')
    setEditingDescription('')
    setEditingDeadline('')
  }

  // 删除待办事项
  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // 切换完成状态
  const handleToggle = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 格式化相对时间显示
  const formatDeadline = (deadline: string): { text: string; isOverdue: boolean; isUrgent: boolean } => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { text: `已过期 ${Math.abs(diffDays)} 天`, isOverdue: true, isUrgent: true }
    } else if (diffDays === 0) {
      return { text: '今天', isOverdue: false, isUrgent: true }
    } else if (diffDays === 1) {
      return { text: '明天', isOverdue: false, isUrgent: true }
    } else if (diffDays <= 3) {
      return { text: `${diffDays} 天后`, isOverdue: false, isUrgent: true }
    } else {
      // 显示完整日期
      const month = deadlineDate.getMonth() + 1
      const day = deadlineDate.getDate()
      return { text: `${month}月${day}日`, isOverdue: false, isUrgent: false }
    }
  }

  // 判断是否过期
  const isOverdue = (deadline?: string): boolean => {
    if (!deadline) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    return deadlineDate.getTime() < today.getTime()
  }

  // 按截止日期排序
  const sortTodosByDeadline = (todos: Todo[]): Todo[] => {
    return [...todos].sort((a, b) => {
      // 都没有日期，保持原顺序
      if (!a.deadline && !b.deadline) return 0
      // a 没有日期，b 有日期，a 排在后面
      if (!a.deadline) return 1
      // b 没有日期，a 有日期，b 排在后面
      if (!b.deadline) return -1
      // 都有日期，按日期升序排序
      const dateA = new Date(a.deadline).getTime()
      const dateB = new Date(b.deadline).getTime()
      return dateA - dateB
    })
  }

  // 计算统计信息
  const totalCount = todos.length
  const completedCount = todos.filter(todo => todo.completed).length
  const activeTodos = sortTodosByDeadline(todos.filter(todo => !todo.completed))
  const completedTodos = sortTodosByDeadline(todos.filter(todo => todo.completed))

  // 渲染单个待办项
  const renderTodoItem = (todo: Todo) => {
    const overdue = !todo.completed && todo.deadline && isOverdue(todo.deadline)
    return (
    <div 
      key={todo.id} 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue-item' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          return
        }
      }}
    >
      <div className="todo-content" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleToggle(todo.id)}
          className="todo-checkbox"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="todo-info">
          {editingId === todo.id && editingField === 'title' ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={() => handleSaveTitle(todo.id)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveTitle(todo.id)
                } else if (e.key === 'Escape') {
                  handleCancelEdit()
                }
              }}
              className="todo-edit-input"
              autoFocus
            />
          ) : (
            <h3
              className={todo.completed ? 'line-through' : ''}
              onClick={(e) => {
                e.stopPropagation()
                if (!todo.completed) {
                  handleStartEditTitle(todo)
                }
              }}
              style={{ cursor: todo.completed ? 'default' : 'pointer' }}
            >
              {todo.title}
            </h3>
          )}

          {editingId === todo.id && editingField === 'description' ? (
            <textarea
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              onBlur={() => {
                handleSaveDescription(todo.id)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancelEdit()
                }
              }}
              className="todo-edit-textarea"
              placeholder="描述（可选）"
              rows={2}
              autoFocus
            />
          ) : todo.description ? (
            <div
              className="todo-description"
              onClick={(e) => {
                e.stopPropagation()
                if (!todo.completed && (editingId !== todo.id || editingField !== 'description')) {
                  handleStartEditDescription(todo)
                }
              }}
              style={{ 
                cursor: todo.completed ? 'default' : 'pointer',
                pointerEvents: 'auto',
                display: 'block',
                width: '100%',
                marginTop: '5px'
              }}
            >
              {todo.description}
            </div>
          ) : (
            <div
              className="todo-description-placeholder"
              onClick={(e) => {
                e.stopPropagation()
                if (!todo.completed && (editingId !== todo.id || editingField !== 'description')) {
                  handleStartEditDescription(todo)
                }
              }}
              style={{ 
                cursor: todo.completed ? 'default' : 'pointer',
                pointerEvents: 'auto',
                display: 'block',
                width: '100%',
                marginTop: '5px'
              }}
            >
              点击添加描述...
            </div>
          )}

          {/* 截止日期显示 */}
          {editingId === todo.id && editingField === 'deadline' ? (
            <input
              type="date"
              value={editingDeadline}
              onChange={(e) => setEditingDeadline(e.target.value)}
              onBlur={() => handleSaveDeadline(todo.id)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancelEdit()
                }
              }}
              className="todo-edit-date"
              autoFocus
            />
          ) : todo.deadline ? (
            <div
              className={`todo-deadline ${isOverdue(todo.deadline) ? 'overdue' : ''} ${formatDeadline(todo.deadline).isUrgent ? 'urgent' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                if (!todo.completed && (editingId !== todo.id || editingField !== 'deadline')) {
                  handleStartEditDeadline(todo)
                }
              }}
              style={{
                cursor: todo.completed ? 'default' : 'pointer',
                pointerEvents: 'auto',
                display: 'inline-block',
                marginTop: '8px'
              }}
            >
              {formatDeadline(todo.deadline).text}
            </div>
          ) : (
            <div
              className="todo-deadline-placeholder"
              onClick={(e) => {
                e.stopPropagation()
                if (!todo.completed && (editingId !== todo.id || editingField !== 'deadline')) {
                  handleStartEditDeadline(todo)
                }
              }}
              style={{
                cursor: todo.completed ? 'default' : 'pointer',
                pointerEvents: 'auto',
                display: 'inline-block',
                marginTop: '8px'
              }}
            >
              点击添加日期...
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => handleDelete(todo.id)}
        className="delete-btn"
      >
        删除
      </button>
    </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <h1>再也不做拖延人啦！</h1>

        <div className="main-layout">
          {/* 左侧：待办列表 */}
          <div className="todo-section">
            {/* 统计信息 */}
            {todos.length > 0 && (
              <div className="todo-stats">
                <span>共 {totalCount} 项，已完成 {completedCount} 项</span>
              </div>
            )}

            <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>还没有待办事项，添加一个吧~</p>
            </div>
          ) : (
            <>
              {/* 未完成组 */}
              {activeTodos.length > 0 && (
                <div className="todo-group">
                  <div className="todo-group-header">
                    <h2 className="todo-group-title">待完成</h2>
                    <span className="todo-group-count">{activeTodos.length}</span>
                  </div>
                  <div className="todo-group-content">
                    {activeTodos.map(todo => renderTodoItem(todo))}
                  </div>
                </div>
              )}

              {/* 已完成组 */}
              {completedTodos.length > 0 && (
                <div className="todo-group">
                  <div 
                    className="todo-group-header clickable"
                    onClick={() => setCompletedCollapsed(!completedCollapsed)}
                  >
                    <h2 className="todo-group-title">已完成</h2>
                    <div className="todo-group-header-right">
                      <span className="todo-group-count">{completedTodos.length}</span>
                      <span className={`collapse-icon ${completedCollapsed ? 'collapsed' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>
                  {!completedCollapsed && (
                    <div className="todo-group-content">
                      {completedTodos.map(todo => renderTodoItem(todo))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
            </div>
          </div>

          {/* 右侧：添加表单 */}
          <div className="form-section">
            <div className="add-form">
              <h2 className="form-section-title">添加待办</h2>
              <div className="form-group">
                <label htmlFor="title">标题 *</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入待办事项标题"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">描述（可选）</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请输入详细描述（可选）"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label htmlFor="deadline">截止日期（可选）</label>
                <input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <button onClick={handleAdd} className="add-btn">
                添加待办
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
