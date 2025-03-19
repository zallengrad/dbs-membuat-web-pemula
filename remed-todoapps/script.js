document.addEventListener('DOMContentLoaded', function(){
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function(e){
    e.preventDefault();
    addTodo();
  })
});

// fungsi utama primary button
function addTodo() {
  const textTodo = document.getElementById('title').value;
  const timestamp = document.getElementById('date').value;

  const generateID = generateId();
  const todoObject = generateTodoObject(generateID, textTodo, timestamp, false)

  todos.push(todoObject);
  document.dispatchEvent(new Event(RENDER_EVENT));

}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted
  }
}

function makeTodo(todoObject) {
  // buat tag-tag
  const textTitle = document.createElement('h2');
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = todoObject.timestamp;

  // buat kotak div pembungkus
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  // masukan tag kedalam div pembungkus
  textContainer.append(textTitle, textTimestamp);

  // div parent dari div atas
  const container = document.createElement('div');
  // buat class
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  // tambah atribut id
  container.setAttribute('id', `todo-${todoObject.id}`);


  // membuat kendali
  if (todoObject.isCompleted === true ) {
    // buat kendali undo
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    // handler undo
    undoButton.addEventListener('click', function(){
      undoTaskFromCompleted(todoObject.id)
    });

    // buat kendali buang (trash)
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    // handler trash
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    // buat kendali selesai mengerjakan
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    // handler selesai mengerjakan
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(todoObject.id);
    });
    
    container.append(checkButton);
  }

  return container
   
}



function addTaskToCompleted (todoId) {
  const todoTarget = findTodo(todoId);
  // mencocokan id di array todos
  if (todoTarget == null) return;
  // bila id nya sama maka ubah kondisi menjadi true
  todoTarget.isCompleted = true;
  // perbaharui UI
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted (todoId) {
  const todoTarget = findTodo(todoId);
  // mencocokan id di array todos
  if (todoTarget === null) return;
  // bila todoTarget ada, maka kembalikan ke posisi false
  todoTarget.isCompleted = false;
  // perbarui UI
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}
// output dari todo id adalah null / {isi object}

function removeTaskFromCompleted (todoId) {
  const todoTarget = findTodoIndex(todoId);
 
  if (todoTarget === -1) return;
 
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
 
  return -1;
}

const todos = [];
const RENDER_EVENT = 'render-todo'

document.addEventListener(RENDER_EVENT, function(){
  // console.log(todos);
  // buat tempat yang belum dikerjakan
  const uncompletedTODOList = document.getElementById('todo-uncompleted');
  // kosongin dulu isi struktur nya
  uncompletedTODOList.innerHTML = '';

  // buat tempat yang sudah dikerjakan
  const completedTODOList = document.getElementById('completed-todos');
  completedTODOList.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    // logika isCompleted === false 
    // maka masukan ke belum dikerjakan
    if(!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement)
    }
  }
})



