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

    const generate_id = generateId();
    const object = generateObject(generate_id, title, author, year, false);

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

 

   // Membuat tombol aksi
   const buttonSelesai = document.createElement('button');
   buttonSelesai.innerText = 'Selesai dibaca';
   buttonSelesai.classList.add('selesai');
   buttonSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');

   const buttonHapus = document.createElement('button');
   buttonHapus.innerText = 'Hapus Buku';
   buttonHapus.classList.add('hapus');
   buttonHapus.setAttribute('data-testid', 'bookItemDeleteButton');

   // Membungkus tombol dalam div
   const buttonContainer = document.createElement('div');
   buttonContainer.classList.add('aksi');
   buttonContainer.append(buttonSelesai, buttonHapus, buttonEdit);

    // buat div parent 1
    const firstContainer = document.createElement('div');
    firstContainer.classList.add('buku-item');
    // tambahkan atribut
    firstContainer.setAttribute('data-testid', 'bookItem');
    firstContainer.setAttribute('data-bookid', object.id);
    // masukan tag kedalam div pembungkus
    firstContainer.append(textTitle, textAuthor, textYear, buttonContainer);

     // membuat logika kendali
   if (object.isCompleted) {
    console.log('selesai')
   } else {
    // kendali selesai
    const buttonSelesai = document.createElement('button');
    buttonSelesai.innerText = 'Selesai dibaca';
    buttonSelesai.classList.add('selesai');
    buttonSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');
    // handler
    buttonSelesai.addEventListener('click', function(){
        addToBookShelf(object.id);
    });

    // kendali hapus
    const buttonHapus = document.createElement('button');
    buttonHapus.innerText = 'Hapus Buku';
    buttonHapus.classList.add('hapus');
    buttonHapus.setAttribute('data-testid', 'bookItemDeleteButton');
    // handler
    buttonHapus.addEventListener('click', function(){
        removeFromBookShelf(object.id);
    });
    // kendali edit
    const buttonEdit = document.createElement('button');
    buttonEdit.innerText = 'Edit Buku';
    buttonHapus.setAttribute('data-testid', 'bookItemEditButton');
    // handler
    buttonEdit.addEventListener('click', function(){
        editBookShelf(object.id);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('aksi');
    buttonContainer.append(buttonSelesai, buttonHapus, buttonEdit);

   };
    
    return firstContainer;
}



const array_book = []
const RENDER_EVENT = 'render-program';

document.addEventListener(RENDER_EVENT, function(){
    // console.log(array_book);
    const notFinishedReading = document.getElementById('incompleteBookList');

    // kosongin dulu isi struktur nya
    notFinishedReading.innerHTML = '';

    for (const book of array_book) {
        const newElementHTML = makeBookshelf(book);
        notFinishedReading.append(newElementHTML);
    }
})
