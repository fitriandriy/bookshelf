/**
 * [
 *    {
 *      id: <int>
 *      judul: <string>
 *      penulis: <string>
 *      tahun: <INT>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
    return +new Date();
}

function generateObject(id, judul, penulis, tahun, isCompleted) {
    return {
      id,
      judul,
      penulis,
      tahun,
      isCompleted
    };
}

function findBook(idBuku) {
    for (const itemBuku of books) {
      if (itemBuku.id === idBuku) {
        return itemBuku;
      }
    }
    return null;
}

function findBookIndex(idBuku) {
    for (const index in books) {
      if (books[index].id === idBuku) {
        return index;
      }
    }
    return -1;
}

/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see books}
 */
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }


  function makeBook(bookObject) {

    const {id, judul, penulis, tahun, isCompleted} = bookObject;
  
    const textTitle = document.createElement('h4');
    textTitle.innerText = judul;
  
    const textPenulis = document.createElement('p');
    textPenulis.innerText = penulis;

    const textTahun = document.createElement('p');
    textTahun.innerText = tahun;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textPenulis, textTahun);
  
    const container = document.createElement('div');
    container.classList.add('item', 'shadow')
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    const button = document.createElement('div');  
    button.classList.add('item-button');  
  
    if (isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');
      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(id);
      });
  
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(id);
      });
  
      button.append(undoButton, trashButton);
      container.append(button);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(id);
      });
  
      button.append(checkButton, trashButton);
      container.append(button);
    }
  
    return container;
  }

  function addBook() {
    const judul = document.getElementById('judul').value;
    const penulis = document.getElementById('penulis').value;
    const tahun = document.getElementById('tahun').value;
  
    const generatedID = generateId();
    const bookObject = generateObject(generatedID, judul, penulis, tahun, false);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    location.reload();
  }
  
  function addTaskToCompleted(bookId /* HTMLELement */) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function removeTaskFromCompleted(bookId /* HTMLELement */) {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function undoTaskFromCompleted(bookId /* HTMLELement */) {
  
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  document.addEventListener('DOMContentLoaded', function () {
  
    const submitForm /* HTMLFormElement */ = document.getElementById('form');
  
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
  });
  
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('books');
    const listCompleted = document.getElementById('completed-books');
  
    // clearing list item
    uncompletedBookList.innerHTML = '';
    listCompleted.innerHTML = '';
  
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isCompleted) {
        listCompleted.append(bookElement);
      } else {
        uncompletedBookList.append(bookElement);
      }
    }
  });
  