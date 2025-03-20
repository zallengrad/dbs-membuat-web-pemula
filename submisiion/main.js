document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', function(e){
        e.preventDefault();
        addBook();
    });

    
    document.getElementById('searchBook').addEventListener('submit', function (event) {
        event.preventDefault(); 
        searchBook();
    });
    
    document.getElementById('searchBookTitle').addEventListener('input', function () {
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

const array_book = [];
const RENDER_EVENT = 'render-program';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APP';

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(array_book);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
 
    if (data !== null) {
        for (const book of data) {
            array_book.push(book);
        }
    }
 
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = Number(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked; 

    const generate_id = generateId();
    const object = generateObject(generate_id, title, author, year, isComplete);

    array_book.push(object);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return Math.floor(Math.random() * 1000000) + Date.now();
}

function generateObject(id, title, author, year, isComplete) {
    return { id, title, author, year, isComplete };
}

function makeBookshelf(object) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = object.title;
    textTitle.setAttribute('data-testid', 'bookItemTitle');

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${object.author}`;
    textAuthor.setAttribute('data-testid', 'bookItemAuthor');

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun: ${object.year}`;
    textYear.setAttribute('data-testid', 'bookItemYear');
    
    const firstContainer = document.createElement('div');
    firstContainer.classList.add('buku-item');
    firstContainer.setAttribute('data-testid', 'bookItem');
    firstContainer.setAttribute('data-bookid', object.id);
    firstContainer.append(textTitle, textAuthor, textYear);

    const buttonEdit = document.createElement('button');
    buttonEdit.innerText = 'Edit';
    buttonEdit.classList.add('edit');
    buttonEdit.setAttribute('data-testid', 'bookItemEditButton');
    buttonEdit.addEventListener('click', function (){
        editBookshelf(object.id);
    });

    const buttonHapus = document.createElement('button');
    buttonHapus.innerText = 'Hapus Buku';
    buttonHapus.classList.add('hapus');
    buttonHapus.setAttribute('data-testid', 'bookItemDeleteButton');
    buttonHapus.addEventListener('click', function (){
        removeFromBookshelf(object.id);
    });

    if (!object.isComplete) {
        const buttonSelesai = document.createElement('button');
        buttonSelesai.innerText = 'Selesai Dibaca';
        buttonSelesai.classList.add('selesai');
        buttonSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');
        buttonSelesai.addEventListener('click', function (){
            addToBookshelf(object.id);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('aksi');
        buttonContainer.append(buttonSelesai, buttonHapus, buttonEdit);
        firstContainer.append(buttonContainer);
    } else {
        const buttonBelumSelesai = document.createElement('button');
        buttonBelumSelesai.innerText = 'Belum Selesai Dibaca';
        buttonBelumSelesai.classList.add('selesai');
        buttonBelumSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');
        buttonBelumSelesai.addEventListener('click', function (){
            undoFromBookshelf(object.id);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('aksi');
        buttonContainer.append(buttonBelumSelesai, buttonHapus, buttonEdit);
        firstContainer.append(buttonContainer);
    }
    return firstContainer;
}

function addToBookshelf(bookId) {
    const target = searchId(bookId);
    if (target === null) return;
    target.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoFromBookshelf(bookId) {
    const target = searchId(bookId);
    if (target === null) return;
    target.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBookshelf(bookId) {
    const target = searchId(bookId);
    if (target === null) return;

    const newTitle = prompt("Judul Buku:", target.title);
    const newAuthor = prompt("Nama Penulis:", target.author);
    const newYear = prompt("Tahun Terbit:", target.year);

    if (newTitle) target.title = newTitle;
    if (newAuthor) target.author = newAuthor;
    if (newYear && !isNaN(newYear)) target.year = newYear;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchId(bookId) {
    return array_book.find(book => book.id === bookId) || null;
}

function removeFromBookshelf(bookId) {
    const target = findIndex(bookId);
    if (target === -1) return;
    array_book.splice(target, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findIndex(bookId) {
    return array_book.findIndex(book => book.id === bookId);
}

document.addEventListener(RENDER_EVENT, function(){
    document.getElementById('incompleteBookList').innerHTML = '';
    document.getElementById('completeBookList').innerHTML = '';
    for (const book of array_book) {
        const newElementHTML = makeBookshelf(book);
        book.isComplete ? document.getElementById('completeBookList').append(newElementHTML) : document.getElementById('incompleteBookList').append(newElementHTML);
    }
});
