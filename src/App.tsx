import { useState } from 'react'
import './App.css'

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')

  // 添加待办事项
  const handleAdd = () => {
    if (title.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false
      }
      setTodos([...todos, newTodo])
      setTitle('')
      setDescription('')
    }
  }

  // 开始编辑标题
  const handleStartEditTitle = (todo: Todo) => {
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
      }
    }
    setEditingId(todo.id)
    setEditingField('description')
    setEditingDescription(todo.description || '')
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

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingField(null)
    setEditingTitle('')
    setEditingDescription('')
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

  return (
    <div className="app">
      <div className="container">
        <h1>TODO List</h1>

        <div className="add-form">
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
              rows={3}
            />
          </div>
          <button onClick={handleAdd} className="add-btn">
            添加待办
          </button>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>还没有待办事项，添加一个吧~</p>
            </div>
          ) : (
            todos.map(todo => (
              <div 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
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
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="delete-btn"
                >
                  删除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
