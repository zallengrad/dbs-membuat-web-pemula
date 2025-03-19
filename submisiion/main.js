document.addEventListener('DOMContentLoaded', function(){
    // inisialisasi aksi
    const submitForm = document.getElementById('bookForm')
    submitForm.addEventListener('submit', function(e){
        e.preventDefault();
        addBook();
    });
});

// fungsi utama
function addBook() {
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isCompleted = document.getElementById('bookFormIsComplete').checked; 

    const generate_id = generateId();
    const object = generateObject(generate_id, title, author, year, isCompleted);

    array_book.push(object);
    document.dispatchEvent(new Event(RENDER_EVENT));
}


// fungsi II
function generateId() {
    return Math.floor(Math.random() * 1000000) + Date.now();
  }

  function generateObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

// fungsi III
// untuk membuat hasil dari eksekusi form
function makeBookshelf (object) {
  // Membuat elemen HTML
  const textTitle = document.createElement('h3');
  textTitle.innerText = object.title;
  textTitle.setAttribute('data-testid', 'bookItemTitle');

  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${object.author}`;
  textAuthor.setAttribute('data-testid', 'bookItemAuthor');

  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${object.year}`;
  textYear.setAttribute('data-testid', 'bookItemYear');
  
  // buat div parent 1
  const firstContainer = document.createElement('div');
  firstContainer.classList.add('buku-item');
  // tambahkan atribut
  firstContainer.setAttribute('data-testid', 'bookItem');
  firstContainer.setAttribute('data-bookid', object.id);
  // masukan tag kedalam div pembungkus
  firstContainer.append(textTitle, textAuthor, textYear);

  //   membuat buton buton
  //   membuat button edit
  const buttonEdit = document.createElement('button');
  buttonEdit.innerText = 'Edit';
  buttonEdit.classList.add('edit');
  buttonEdit.setAttribute('data-testid', 'bookItemIsCompleteButton')

  // kendali event listener btn selesai
  buttonEdit.addEventListener('click', function (){
      editBookshelf(object.id);
  });

      // buat btn hapus
      const buttonHapus = document.createElement('button');
      buttonHapus.innerText = 'Hapus Buku';
      buttonHapus.classList.add('hapus');
      buttonHapus.setAttribute('data-testid', 'bookItemDeleteButton');
  
      // kendali eventlistener btn hapus
      buttonHapus.addEventListener('click', function (){
          removeFromBookshelf(object.id);
      });


  // membuat button kendali 
  if (!object.isCompleted === true){
    // buat btn selesai
    const buttonSelesai = document.createElement('button');
    buttonSelesai.innerText = 'Selesai Dibaca';
    buttonSelesai.classList.add('selesai');
    buttonSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton')

    // kendali event listener btn selesai
    buttonSelesai.addEventListener('click', function (){
        addToBookshelf(object.id);
    });

    // buat div parent 1
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('aksi');
    buttonContainer.append(buttonSelesai, buttonHapus, buttonEdit);

    firstContainer.append(buttonContainer)
  } else {
    // buat btn hapus
    // buat btn belum selesai dibaca
    const buttonBelumSelesai = document.createElement('button');
    buttonBelumSelesai.innerText = 'Belum Selesai Dibaca';
    buttonBelumSelesai.classList.add('selesai');
    buttonBelumSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');

    // kendali eventListener belum selesai
    buttonBelumSelesai.addEventListener('click', function (){
        undoFromBookshelf(object.id);
    });


    // buat div parent 1
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('aksi');
    buttonContainer.append(buttonBelumSelesai, buttonHapus, buttonEdit);
    firstContainer.append(buttonContainer);
  }
  return firstContainer;
}

// Fungsi IV
// membuat fungsi button
function addToBookshelf(bookId){
    const target = searchId(bookId)

    if (target === null) return;

    target.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoFromBookshelf(bookId) {
    const target = searchId(bookId);

    if (target === null) return;

    target.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function editBookshelf(bookId) {
    const target = searchId(bookId);

    if (target === null) {
        return;
    }

    const newTitle = prompt("Judul Buku:", target.title);
    const newAuthor = prompt("Nama Penulis:", target.author);
    const newYear = prompt("Tahun Terbit:", target.year);

    if (newTitle !== null && newTitle.trim() !== "") {
        target.title = newTitle;
    }
    if (newAuthor !== null && newAuthor.trim() !== "") {
        target.author = newAuthor;
    }
    if (newYear !== null && !isNaN(newYear) && newYear.trim() !== "") {
        target.year = newYear;
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function searchId(bookId){
    for (bookCatalog of array_book) {
        if (bookCatalog.id === bookId){
            return bookCatalog;
        }
    }
    return null;
}

// membuat fungsi hapus
function removeFromBookshelf (bookId) {
    const target = findIndex(bookId);
   
    if (target === -1) return;
   
    array_book.splice(target, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  
  function findIndex(bookId) {
    for (const index in array_book) {
        if (array_book[index].id === bookId) {
            return Number(index); 
        }
    }
    return -1;
}

// fungsi V
// membuat fitur cari buku
// function searchBook() {
//     const searchText = document.getElementById('searchBookTitle').value.toLowerCase(); 
//     const notFinishedReading = document.getElementById('incompleteBookList');
//     const finishedReading = document.getElementById('completeBookList');

//     notFinishedReading.innerHTML = ''; 
//     finishedReading.innerHTML = ''; 

//     for (const book of array_book) {
//         if (book.title.toLowerCase().includes(searchText)) {
//             const newElementHTML = makeBookshelf(book);
//             if (!book.isCompleted) {
//                 notFinishedReading.append(newElementHTML);
//             } else {
//                 finishedReading.append(newElementHTML);
//             }
//         }
//     }
// }

// document.getElementById('searchButton').addEventListener('click', function () {
//     searchBook();
// });







const array_book = []
const RENDER_EVENT = 'render-program';

document.addEventListener(RENDER_EVENT, function(){
    // console.log(array_book);

    // tempat bagi yang belum selesai dibaca
    const notFinishedReading = document.getElementById('incompleteBookList');
    // kosongin dulu isi struktur nya
    notFinishedReading.innerHTML = '';

    // tempat bagi yang sudah selesai dibaca
    const fisnishedReading = document.getElementById('completeBookList');
    // kosongin dulu isi struktur HTML nya
    fisnishedReading.innerHTML = '';

    for (const book of array_book) {
        const newElementHTML = makeBookshelf(book);

        if (!book.isCompleted){
            notFinishedReading.append(newElementHTML);
        } else {
            fisnishedReading.append(newElementHTML);
        }
    }
})

