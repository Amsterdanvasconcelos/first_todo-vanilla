const formAddTodo = document.querySelector('[data-js="form-add"]')
const todoList = document.querySelector('[data-js="todo-list"]')
const todoImg = document.querySelector('[data-js="todo-img"]')
const btnDeleteAll = document.querySelector('[data-js="btn-deleteAll"]')

let tasksLocalStorage = JSON.parse(localStorage.getItem('Tasks')) || []

const resetForm = () => {
  formAddTodo.reset() 
  formAddTodo.input.focus()
}

const showOrHiddenTodoImg = () => {
  const tasks = Array.from(document.querySelectorAll('[data-item="todo-item"]'))

  if (tasks.length) {
    todoImg.classList.add('hidden')
    return
  }

  todoImg.classList.remove('hidden')
}

const showOrHiddenBtnDeleteAll = () => {
  const tasks = Array.from(document.querySelectorAll('[data-item="todo-item"]'))

  if (tasks.length > 1) {
    btnDeleteAll.classList.remove('hidden')
    return
  }

  btnDeleteAll.classList.add('hidden')
}

const showTasksLocalStorage = () => {
  const tasksLocalStorageForShow = tasksLocalStorage
  tasksLocalStorage = []
  tasksLocalStorageForShow.forEach((task) => addTodo(task))
}

const addTaskLocalStorage = ({ text, isConcluded }) => {
  tasksLocalStorage.push({ text, isConcluded })

  localStorage.setItem('Tasks', JSON.stringify(tasksLocalStorage))
}

const removeTaskLocalStorage = task => {
  tasksLocalStorage = tasksLocalStorage.filter(item => item.text !== task)
 
  localStorage.setItem('Tasks', JSON.stringify(tasksLocalStorage))
}

const removeAllTasksLocalStorage = () => {
  tasksLocalStorage.splice(0)
  localStorage.setItem('Tasks', JSON.stringify(tasksLocalStorage))
}

const modifyValueOfPropertyIsConcluded = (task, newValue) => {
  const createNewArrWithModifiedPropertyValue = ({ text, isConcluded }) => {
    if (text === task) {
      return { text, isConcluded: newValue }
    }

    return { text, isConcluded }
  }
  
  const newTasksLocalStorage = tasksLocalStorage
    .map(createNewArrWithModifiedPropertyValue)

  tasksLocalStorage = newTasksLocalStorage
  localStorage.setItem('Tasks', JSON.stringify(tasksLocalStorage))
}

const addTodo = ({ text, isConcluded }) => {
  const thisTaskAlreadyExists = tasksLocalStorage.some(item => item.text === text)

  if (thisTaskAlreadyExists) {
    alert('Esta tarefa já existe na sua lista.')
    return
  }

  const hasTheConcludedClass = isConcluded && 'concluded'
  
  if (text) {
    const taskTemplateHTML = 
    `<div class="todo__list-item ${hasTheConcludedClass}" data-item="todo-item" data-todo="${text}">
      <span data-text="${text}">${text}</span>
      <button class="todo__btn-delete" type="button" data-trash="${text}">Deletar</button>
    </div>`

    todoList.insertAdjacentHTML('afterbegin', taskTemplateHTML)

    addTaskLocalStorage({ text, isConcluded })
  }
}

const removeTodo = clickedElement => {
  const trashDataValue = clickedElement.dataset.trash
  const todo = document.querySelector(`[data-todo="${trashDataValue}"]`)

  if (trashDataValue) {
    todo.remove()

    removeTaskLocalStorage(trashDataValue)
  }
}

const concludeTodo = event => {
  const clickedElement = event.target
  const dataValue = clickedElement.dataset.todo || clickedElement.dataset.text
  const todo = document.querySelector(`[data-todo="${dataValue}"]`)

  if (dataValue) {
    todo.classList.toggle('concluded')

    const includesConcludedClass = todo.classList.value.includes('concluded')

    if (includesConcludedClass) {
      modifyValueOfPropertyIsConcluded(dataValue, true)
    }
    else {
      modifyValueOfPropertyIsConcluded(dataValue, false)
    }
  }
}

const removeAllTodo = () => {
  const tasks = document.querySelectorAll('[data-item="todo-item"]')

  tasks.forEach(task => task.remove())
  removeAllTasksLocalStorage()
} 

const handleFormAddTodoSubmit = event => {
  event.preventDefault()

  const inputValue = formAddTodo.input.value.trim()

  addTodo({ text: inputValue, isConcluded: false })
  showOrHiddenTodoImg()
  showOrHiddenBtnDeleteAll()
  resetForm()
}

const handleTodoListClick = event => {
  const clickedElement = event.target
  
  removeTodo(clickedElement)
  showOrHiddenTodoImg()
  showOrHiddenBtnDeleteAll()
}

formAddTodo.addEventListener('submit', handleFormAddTodoSubmit)
todoList.addEventListener('click', handleTodoListClick)
todoList.addEventListener('dblclick', concludeTodo)
btnDeleteAll.addEventListener('click', removeAllTodo)

showTasksLocalStorage()
showOrHiddenTodoImg()
showOrHiddenBtnDeleteAll()
// localStorage.clear()