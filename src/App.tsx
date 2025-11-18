import { useState, useEffect, useRef } from 'react'
import './App.css'

const STORAGE_KEY = 'todo-list-app'

type Category = 'work' | 'study' | 'life'

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  deadline?: string // 截止日期，格式：YYYY-MM-DD
  category?: Category // 分类：工作/学习/生活
  order?: number // 自定义排序顺序，越小越靠前
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'title' | 'description' | 'deadline' | 'category' | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const [editingDeadline, setEditingDeadline] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | ''>('')
  const [completedCollapsed, setCompletedCollapsed] = useState(true) 
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
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
        category: category || undefined,
        completed: false
      }
      setTodos([...todos, newTodo])
      setTitle('')
      setDescription('')
      setDeadline('')
      setCategory('')
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
      } else if (editingField === 'category') {
        handleSaveCategory(editingId)
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
      } else if (editingField === 'category') {
        handleSaveCategory(editingId)
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
      } else if (editingField === 'category') {
        handleSaveCategory(editingId)
      }
    }
    setEditingId(todo.id)
    setEditingField('deadline')
    setEditingDeadline(todo.deadline || '')
  }

  // 开始编辑分类
  const handleStartEditCategory = (todo: Todo) => {
    if (editingId && editingId !== todo.id) {
      if (editingField === 'title') {
        handleSaveTitle(editingId)
      } else if (editingField === 'description') {
        handleSaveDescription(editingId)
      } else if (editingField === 'deadline') {
        handleSaveDeadline(editingId)
      } else if (editingField === 'category') {
        handleSaveCategory(editingId)
      }
    }
    setEditingId(todo.id)
    setEditingField('category')
    setEditingCategory(todo.category || '')
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

  // 保存分类
  const handleSaveCategory = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, category: editingCategory || undefined }
        : todo
    ))
    setEditingId(null)
    setEditingField(null)
    setEditingCategory('')
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingField(null)
    setEditingTitle('')
    setEditingDescription('')
    setEditingDeadline('')
    setEditingCategory('')
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

  // 获取分类显示名称
  const getCategoryName = (category?: Category): string => {
    switch (category) {
      case 'work': return '工作'
      case 'study': return '学习'
      case 'life': return '生活'
      default: return '无分类'
    }
  }

  // 分类排序优先级：工作 > 学习 > 生活 > 无分类
  const getCategoryOrder = (category?: Category): number => {
    switch (category) {
      case 'work': return 1
      case 'study': return 2
      case 'life': return 3
      default: return 4
    }
  }

  // 按分类、自定义顺序和截止日期排序
  const sortTodosByCategoryAndDeadline = (todos: Todo[]): Todo[] => {
    return [...todos].sort((a, b) => {
      // 1. 先按分类排序
      const categoryOrderA = getCategoryOrder(a.category)
      const categoryOrderB = getCategoryOrder(b.category)
      if (categoryOrderA !== categoryOrderB) {
        return categoryOrderA - categoryOrderB
      }
      
      // 2. 同分类内，优先按自定义顺序排序
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      // a 有自定义顺序，b 没有，a 排在前面
      if (a.order !== undefined) return -1
      // b 有自定义顺序，a 没有，b 排在前面
      if (b.order !== undefined) return 1
      
      // 3. 都没有自定义顺序，按日期排序
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

  // 处理拖拽开始
  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  // 处理拖拽悬停
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (draggedId && draggedId !== id) {
      setDragOverId(id)
    }
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    if (draggedId && dragOverId && draggedId !== dragOverId) {
      const draggedTodo = todos.find(t => t.id === draggedId)
      const targetTodo = todos.find(t => t.id === dragOverId)
      
      // 只在同分类、同完成状态内才能拖拽排序
      if (draggedTodo && targetTodo && 
          draggedTodo.category === targetTodo.category &&
          draggedTodo.completed === targetTodo.completed) {
        
        // 获取同分类、同完成状态的待办项（排除被拖拽的项）
        const sameCategoryTodos = todos.filter(t => 
          t.category === draggedTodo.category && 
          t.completed === draggedTodo.completed &&
          t.id !== draggedId
        )
        const sortedTodos = sortTodosByCategoryAndDeadline(sameCategoryTodos)
        
        const targetIndex = sortedTodos.findIndex(t => t.id === dragOverId)
        
        if (targetIndex !== -1) {
          // 计算新的 order 值
          let newOrder: number
          
          if (targetIndex === 0) {
            // 拖到最前面
            const firstOrder = sortedTodos[0]?.order
            newOrder = firstOrder !== undefined ? firstOrder - 1000 : 0
          } else if (targetIndex === sortedTodos.length - 1) {
            // 拖到最后面
            const lastOrder = sortedTodos[sortedTodos.length - 1]?.order
            newOrder = lastOrder !== undefined ? lastOrder + 1000 : sortedTodos.length * 1000
          } else {
            // 拖到中间位置
            const prevOrder = sortedTodos[targetIndex - 1]?.order
            const nextOrder = sortedTodos[targetIndex]?.order
            
            if (prevOrder !== undefined && nextOrder !== undefined) {
              newOrder = (prevOrder + nextOrder) / 2
            } else if (prevOrder !== undefined) {
              newOrder = prevOrder + 1000
            } else if (nextOrder !== undefined) {
              newOrder = nextOrder - 1000
            } else {
              newOrder = targetIndex * 1000
            }
          }
          
          // 更新 draggedTodo 的 order
          setTodos(todos.map(todo =>
            todo.id === draggedId ? { ...todo, order: newOrder } : todo
          ))
        }
      }
    }
    setDraggedId(null)
    setDragOverId(null)
  }

  // 重置排序（清除所有自定义顺序）
  const handleResetSort = () => {
    setTodos(todos.map(todo => {
      const { order, ...rest } = todo
      return rest
    }))
  }

  // 搜索功能：搜索标题、描述、分类（支持分词搜索）
  const filterTodosBySearch = (todos: Todo[]): Todo[] => {
    if (!searchQuery.trim()) {
      return todos
    }
    
    // 分词：按空格分割，过滤空字符串
    const keywords = searchQuery.trim().toLowerCase().split(/\s+/).filter(k => k.length > 0)
    
    if (keywords.length === 0) {
      return todos
    }
    
    return todos.filter(todo => {
      // 将待办的所有文本内容合并成一个字符串用于搜索
      const searchText = [
        todo.title,
        todo.description || '',
        todo.category ? getCategoryName(todo.category) : ''
      ].join(' ').toLowerCase()
      
      // 检查是否包含所有关键词（AND逻辑：必须同时包含所有词）
      return keywords.every(keyword => searchText.includes(keyword))
    })
  }

  // 高亮搜索关键词（支持多个关键词）
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) {
      return text
    }
    
    // 分词：按空格分割关键词
    const keywords = query.trim().toLowerCase().split(/\s+/).filter(k => k.length > 0)
    
    if (keywords.length === 0) {
      return text
    }
    
    // 转义所有关键词中的特殊字符
    const escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    
    // 创建匹配所有关键词的正则表达式
    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      const isMatch = keywords.some(keyword => part.toLowerCase() === keyword.toLowerCase())
      return isMatch ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    })
  }

  // 计算统计信息
  const totalCount = todos.length
  const completedCount = todos.filter(todo => todo.completed).length
  const filteredActiveTodos = filterTodosBySearch(todos.filter(todo => !todo.completed))
  const filteredCompletedTodos = filterTodosBySearch(todos.filter(todo => todo.completed))
  const activeTodos = sortTodosByCategoryAndDeadline(filteredActiveTodos)
  const completedTodos = sortTodosByCategoryAndDeadline(filteredCompletedTodos)

  // 渲染单个待办项
  const renderTodoItem = (todo: Todo) => {
    const overdue = !todo.completed && todo.deadline && isOverdue(todo.deadline)
    const isDragging = draggedId === todo.id
    const isDragOver = dragOverId === todo.id
    return (
    <div 
      key={todo.id} 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue-item' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => handleDragOver(e, todo.id)}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          return
        }
      }}
    >
      {/* 拖拽手柄 */}
      {!todo.completed && (
        <div 
          className="drag-handle"
          draggable={true}
          onDragStart={(e) => {
            handleDragStart(todo.id)
            e.dataTransfer.effectAllowed = 'move'
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          title="拖拽排序（仅限同分类内）"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2" cy="2" r="1" fill="#8B8B8B"/>
            <circle cx="6" cy="2" r="1" fill="#8B8B8B"/>
            <circle cx="10" cy="2" r="1" fill="#8B8B8B"/>
            <circle cx="2" cy="6" r="1" fill="#8B8B8B"/>
            <circle cx="6" cy="6" r="1" fill="#8B8B8B"/>
            <circle cx="10" cy="6" r="1" fill="#8B8B8B"/>
            <circle cx="2" cy="10" r="1" fill="#8B8B8B"/>
            <circle cx="6" cy="10" r="1" fill="#8B8B8B"/>
            <circle cx="10" cy="10" r="1" fill="#8B8B8B"/>
          </svg>
        </div>
      )}
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
              {searchQuery ? highlightText(todo.title, searchQuery) : todo.title}
            </h3>
          )}

          {/* 分类显示 */}
          {editingId === todo.id && editingField === 'category' ? (
            <select
              value={editingCategory}
              onChange={(e) => setEditingCategory(e.target.value as Category | '')}
              onBlur={() => handleSaveCategory(todo.id)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancelEdit()
                }
              }}
              className="todo-edit-category"
              autoFocus
            >
              <option value="">无分类</option>
              <option value="work">工作</option>
              <option value="study">学习</option>
              <option value="life">生活</option>
            </select>
          ) : (
            <div
              className={`todo-category category-${todo.category || 'none'}`}
              onClick={(e) => {
                e.stopPropagation()
                if (!todo.completed && (editingId !== todo.id || editingField !== 'category')) {
                  handleStartEditCategory(todo)
                }
              }}
              style={{
                cursor: todo.completed ? 'default' : 'pointer',
                pointerEvents: 'auto',
                display: 'inline-block',
                marginTop: '5px',
                marginRight: '8px'
              }}
            >
              {searchQuery ? highlightText(getCategoryName(todo.category), searchQuery) : getCategoryName(todo.category)}
            </div>
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
              {searchQuery ? highlightText(todo.description, searchQuery) : todo.description}
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
            {/* 搜索框 */}
            {todos.length > 0 && (
              <div className="search-box">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索待办事项（标题、描述、分类）"
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="search-clear-btn"
                    title="清除搜索"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* 统计信息 */}
            {todos.length > 0 && (
              <div className="todo-stats">
                <span>
                  {searchQuery ? (
                    <>搜索到 {activeTodos.length + completedTodos.length} 项（共 {totalCount} 项，已完成 {completedCount} 项）</>
                  ) : (
                    <>共 {totalCount} 项，已完成 {completedCount} 项</>
                  )}
                </span>
              </div>
            )}

            <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>还没有待办事项，添加一个吧~</p>
            </div>
          ) : searchQuery && activeTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="empty-state">
              <p>没有找到匹配的待办事项</p>
            </div>
          ) : (
            <>
              {/* 未完成组 */}
              {activeTodos.length > 0 && (
                <div className="todo-group">
                  <div className="todo-group-header">
                    <div className="todo-group-title-wrapper">
                      <h2 className="todo-group-title">待完成</h2>
                      <span className="todo-group-count">{activeTodos.length}</span>
                    </div>
                    {todos.some(todo => todo.order !== undefined) && (
                      <button 
                        onClick={handleResetSort}
                        className="reset-sort-btn"
                        title="重置为自动排序"
                      >
                        重置排序
                      </button>
                    )}
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
              <div className="form-group">
                <label htmlFor="category">分类（可选）</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category | '')}
                  className="form-select"
                >
                  <option value="">无分类</option>
                  <option value="work">工作</option>
                  <option value="study">学习</option>
                  <option value="life">生活</option>
                </select>
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
