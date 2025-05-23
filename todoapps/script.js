function generateID() {
    return +new Date();
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const todo of data) {
        todos.push(todo);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }


function generatetodoObject(id, task, timeStamp, isCompleted) {
    return {
        id,
        task,
        timeStamp,
        isCompleted
    };
}

const todos = [];
const RENDER_EVENT = 'render_todo';

function findTodo(todoID) {
    for (const todoItem of todos) {
        if (todoItem.id === todoID) {
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId) {
    for (index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }
    return -1;
}

function makeTodo(todoObject) {

    const {id, task, timestamp, isCompleted} = todoObject;

    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerTextc = todoObject.timeStamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`)


    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function() {
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    return container


}

function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timeStamp = document.getElementById('date').value;

    const newID = generateID(); 
    const todoObject = generatetodoObject(newID, textTodo, timeStamp, false);

    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function addTaskToCompleted(todoID) {
    const todoTarget = findTodo(todoID);

    if (todoTarget == null ) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event (RENDER_EVENT));
}

function removeTaskFromCompleted(todoId /* HTMLELement */) {
    const todoTarget = findTodoIndex(todoId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function undoTaskFromCompleted(todoId /* HTMLELement */) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
  
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
      }
});



document.addEventListener(RENDER_EVENT, function (){
    const uncompletedTODOList = document.getElementById('todos');
    const listCompleted = document.getElementById('completed-todos');
  
    // clearing list item
    uncompletedTODOList.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (todoItem.isCompleted) {
        listCompleted.append(todoElement);
      } else {
        uncompletedTODOList.append(todoElement);
      }
    }


    // const uncompletedTODOList = document.getElementById('todos');
    // uncompletedTODOList.innerHTML = '';
   
    // const completedTODOList = document.getElementById('completed-todos');
    // completedTODOList.innerHTML = '';
   
    // for (const todoItem of todos) {
    //   const todoElement = makeTodo(todoItem);
    //   if (!todoItem.isCompleted)
    //     uncompletedTODOList.append(todoElement);
    //   else
    //     completedTODOList.append(todoElement);
    // }


    // const uncompletedTODOList = document.getElementById('todos');
    // uncompletedTODOList.innerHTML = '';
   
    // for (const todoItem of todos) {
    //   const todoElement = makeTodo(todoItem);
    //   if (!todoItem.isCompleted) {
    //     uncompletedTODOList.append(todoElement);
    //   }
    // }



    // console.log(todos);
    // const uncompletedTODOList = document.getElementById('todos');
    // uncompletedTODOList.innerHTML = '';

    // for (const todoItem of todos) {
    //     const todoElement = makeTodo(todoItem);
    //     uncompletedTODOList.append(todoElement);
    // }
});