const formAddTodo = document.querySelector('[data-js="form-add"]')
const todoList = document.querySelector('[data-js="todo-list"]')
const todoImg = document.querySelector('[data-js="todo-img"]')
const btnDeleteAll = document.querySelector('[data-js="btn-deleteAll"]')

let currentListOfTasks = JSON.parse(localStorage.getItem('Tasks')) || []

const resetForm = () => {
  formAddTodo.reset() 
  formAddTodo.input.focus()
}

const showOrHiddenTodoImg = () => {
  if (currentListOfTasks.length) {
    todoImg.classList.add('hidden')
    return
  }

  todoImg.classList.remove('hidden')
}

const showOrHiddenBtnDeleteAll = () => {
  if (currentListOfTasks.length > 1) {
    btnDeleteAll.classList.remove('hidden')
    return
  }

  btnDeleteAll.classList.add('hidden')
}

const addTaskInTheListTasks = task => {
  const thisTaskAlreadyExists = currentListOfTasks.some(item => item.task === task)
  
  if (thisTaskAlreadyExists) {
    alert('Esta tarefa já existe na sua lista.')
    return
  }
  currentListOfTasks.push({ task, isConcluded: false })
}

const removeTaskOfTheListTasks = clickedElement => {
  const taskToRemoved = clickedElement.dataset.trash

  if (taskToRemoved === 'deleteAll') {
    currentListOfTasks = []
    return
  }
  
  if (taskToRemoved) {
    const index = currentListOfTasks.indexOf(taskToRemoved)
    currentListOfTasks.splice(index, 1)
  }
}

const renderTasks = () => {
  const taskItensInsiderDOM = document.querySelectorAll('[data-item="todo-item"]')
  if (taskItensInsiderDOM) taskItensInsiderDOM.forEach(item => item.remove())
   
  currentListOfTasks.forEach(({ task, isConcluded }) => {
    const hasClassConcluded = isConcluded ? 'concluded' : ''
    
    const taskTemplateHTML = 
      `<div class="todo__list-item ${hasClassConcluded}" data-item="todo-item" data-todo="${task}">
        <span data-text="${task}">${task}</span>
        <button class="todo__btn-delete" type="button" data-trash="${task}">Deletar</button>
      </div>`

    todoList.insertAdjacentHTML('afterbegin', taskTemplateHTML)
  })
}

const updateElementsTodo = () => {
  renderTasks()
  showOrHiddenTodoImg()
  showOrHiddenBtnDeleteAll()
}

const updateLocalStorage = () => {
  localStorage.setItem('Tasks', JSON.stringify(currentListOfTasks))

  if (!currentListOfTasks.length) {
    localStorage.removeItem('Tasks')
  }
}

const concludeTask = ({ target }) => {
  const clickedElement = target
  const dataValue = clickedElement.dataset.todo || clickedElement.dataset.text

  if (dataValue) {
    const newCurrentListOfTasks = currentListOfTasks.map(({ task, isConcluded }) => {
      if (task === dataValue) {
        return { task, isConcluded: !isConcluded }
      }

      return { task, isConcluded }
    })

    currentListOfTasks = newCurrentListOfTasks

    updateElementsTodo()
    updateLocalStorage()
  }
}

const handleFormAddTodoSubmit = event => {
  event.preventDefault()

  const inputValue = formAddTodo.input.value.trim()

  if (inputValue) {
    const lengthListBeforeRemovingTheTask = currentListOfTasks.length
    
    addTaskInTheListTasks(inputValue)

    if (lengthListBeforeRemovingTheTask !== currentListOfTasks.length) {
      updateElementsTodo()
      updateLocalStorage()
    }
  }
  resetForm()
}

const handleTodoListClick = ({ target }) => {
  const clickedElement = target
  
  const lengthListBeforeRemovingTheTask = currentListOfTasks.length

  removeTaskOfTheListTasks(clickedElement)
  
  if (lengthListBeforeRemovingTheTask !== currentListOfTasks.length) {
    updateElementsTodo()
    updateLocalStorage()
  }
}

formAddTodo.addEventListener('submit', handleFormAddTodoSubmit)
todoList.addEventListener('click', handleTodoListClick)
todoList.addEventListener('dblclick', concludeTask)

updateElementsTodo()