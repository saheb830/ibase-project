// ==========================================
// LIBRARY BOOK DATA
// ==========================================

let books = [
    {
        id: 1,
        title: "Java Programming",
        author: "Herbert Schildt",
        category: "Programming",
        available: true
    },
    {
        id: 2,
        title: "Python Programming",
        author: "Guido van Rossum",
        category: "Programming",
        available: true
    },
    {
        id: 3,
        title: "Database Management System",
        author: "Raghu Ramakrishnan",
        category: "Database",
        available: false
    },
    {
        id: 4,
        title: "Computer Networks",
        author: "Andrew S. Tanenbaum",
        category: "Networking",
        available: true
    },
    {
        id: 5,
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Novel",
        available: true
    },
    {
        id: 6,
        title: "Wings of Fire",
        author: "A. P. J. Abdul Kalam",
        category: "Novel",
        available: true
    },
    {
        id: 7,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Programming",
        available: true
    },
    {
        id: 8,
        title: "Operating System Concepts",
        author: "Abraham Silberschatz",
        category: "Programming",
        available: false
    },
    {
        id: 9,
        title: "Physics Fundamentals",
        author: "David Halliday",
        category: "Science",
        available: true
    }
];


// ==========================================
// RESERVATIONS
// ==========================================

let reservations = [];


// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks(bookList = books) {

    const container = document.getElementById("bookContainer");

    container.innerHTML = "";

    if (bookList.length === 0) {

        container.innerHTML = `
            <p style="grid-column: 1/-1; text-align:center;">
                No books found.
            </p>
        `;

        return;
    }

    bookList.forEach(book => {

        const card = document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `

            <div class="book-cover">
                📖
            </div>

            <div class="book-info">

                <span class="category">
                    ${book.category}
                </span>

                <h3>${book.title}</h3>

                <p>
                    <strong>Author:</strong>
                    ${book.author}
                </p>

                <p class="${book.available ? "available" : "issued"}">
                    ${book.available ? "● Available" : "● Issued"}
                </p>

                ${
                    book.available
                    ?
                    `<button
                        class="btn reserve-btn"
                        onclick="openReservation(${book.id})">
                        Reserve Book
                    </button>`
                    :
                    `<button
                        class="btn reserve-btn"
                        disabled>
                        Currently Issued
                    </button>`
                }

            </div>
        `;

        container.appendChild(card);
    });
}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const totalBooks = books.length;

    const availableBooks =
        books.filter(book => book.available).length;

    const issuedBooks =
        books.filter(book => !book.available).length;

    document.getElementById("totalBooks").textContent =
        totalBooks;

    document.getElementById("availableBooks").textContent =
        availableBooks;

    document.getElementById("issuedBooks").textContent =
        issuedBooks;

    document.getElementById("totalReservations").textContent =
        reservations.length;
}


// ==========================================
// SEARCH BOOKS
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener("input", filterBooks);

document
    .getElementById("categoryFilter")
    .addEventListener("change", filterBooks);


function filterBooks() {

    const searchText =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const category =
        document
        .getElementById("categoryFilter")
        .value;

    const filteredBooks = books.filter(book => {

        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "all" ||
            book.category === category;

        return matchesSearch && matchesCategory;
    });

    displayBooks(filteredBooks);
}


// ==========================================
// OPEN RESERVATION MODAL
// ==========================================

function openReservation(bookId) {

    const book =
        books.find(book => book.id === bookId);

    if (!book || !book.available) {

        alert("This book is currently unavailable.");

        return;
    }

    document.getElementById("selectedBook").value =
        book.id;

    document.getElementById("bookName").value =
        book.title;

    document.getElementById("reservationModal").style.display =
        "block";
}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    document.getElementById("reservationModal").style.display =
        "none";

    document.getElementById("reservationForm").reset();
}


// ==========================================
// RESERVATION FORM
// ==========================================

document
    .getElementById("reservationForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const bookId =
            Number(document.getElementById("selectedBook").value);

        const book =
            books.find(book => book.id === bookId);

        const studentName =
            document.getElementById("studentName").value;

        const studentId =
            document.getElementById("studentId").value;

        const date =
            document.getElementById("reservationDate").value;


        if (!book) {

            alert("Book not found.");

            return;
        }


        if (!book.available) {

            alert("This book is no longer available.");

            closeModal();

            return;
        }


        // Create reservation
        const reservation = {

            id: Date.now(),

            bookId: book.id,

            bookName: book.title,

            studentName: studentName,

            studentId: studentId,

            date: date,

            status: "Reserved"
        };


        reservations.push(reservation);


        // Make book unavailable
        book.available = false;


        alert(
            "Book reserved successfully!"
        );


        closeModal();

        displayBooks();

        displayReservations();

        updateDashboard();
    });


// ==========================================
// DISPLAY RESERVATIONS
// ==========================================

function displayReservations() {

    const table =
        document.getElementById("reservationTable");

    table.innerHTML = "";


    if (reservations.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No reservations found.
                </td>
            </tr>
        `;

        return;
    }


    reservations.forEach(reservation => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${reservation.bookName}
            </td>

            <td>
                ${reservation.studentName}
                <br>
                <small>ID: ${reservation.studentId}</small>
            </td>

            <td>
                ${reservation.date}
            </td>

            <td>
                <strong>
                    ${reservation.status}
                </strong>
            </td>

            <td>

                <button
                    class="cancel-btn"
                    onclick="cancelReservation(${reservation.id})">
                    Cancel
                </button>

            </td>
        `;

        table.appendChild(row);
    });
}


// ==========================================
// CANCEL RESERVATION
// ==========================================

function cancelReservation(reservationId) {

    const reservation =
        reservations.find(
            reservation =>
            reservation.id === reservationId
        );


    if (!reservation) {
        return;
    }


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this reservation?"
        );


    if (!confirmCancel) {
        return;
    }


    // Make book available again
    const book =
        books.find(
            book =>
            book.id === reservation.bookId
        );


    if (book) {
        book.available = true;
    }


    // Remove reservation
    reservations =
        reservations.filter(
            reservation =>
            reservation.id !== reservationId
        );


    displayBooks();

    displayReservations();

    updateDashboard();
}


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener("click", function(event) {

    const modal =
        document.getElementById("reservationModal");

    if (event.target === modal) {

        closeModal();
    }
});


// ==========================================
// INITIAL LOAD
// ==========================================

displayBooks();

displayReservations();

updateDashboard();