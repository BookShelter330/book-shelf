// BookShelf Pro - Повністю робоча версія
const app = {
    books: [],
    currentBook: null,
    editBookId: null,
    language: 'uk',
    theme: 'dark',
    
    // Ініціалізація
    async init() {
        this.loadData();
        this.applyTheme();
        this.renderLibrary();
        this.showHome();
    },
    
    loadData() {
        // Завантаження книг
        const savedBooks = localStorage.getItem('bookshelf_books');
        if (savedBooks) {
            this.books = JSON.parse(savedBooks);
        } else {
            this.books = this.getDemoBooks();
        }
        
        // Завантаження налаштувань
        const savedTheme = localStorage.getItem('bookshelf_theme');
        if (savedTheme) this.theme = savedTheme;
        
        const savedLang = localStorage.getItem('bookshelf_lang');
        if (savedLang) this.language = savedLang;
    },
    
    saveData() {
        localStorage.setItem('bookshelf_books', JSON.stringify(this.books));
        localStorage.setItem('bookshelf_theme', this.theme);
        localStorage.setItem('bookshelf_lang', this.language);
        this.updateStats();
    },
    
    getDemoBooks() {
        return [
            {
                id: Date.now(),
                title: "Майстер і Маргарита",
                author: "Михайло Булгаков",
                review: "Геніальний роман про кохання, владу та вічні цінності.",
                cover: "",
                read: false,
                rating: 9
            },
            {
                id: Date.now() + 1,
                title: "451 градус за Фаренгейтом",
                author: "Рей Бредбері",
                review: "Класична антиутопія про цінність книг та свободи думки.",
                cover: "",
                read: true,
                rating: 8
            }
        ];
    },
    
    updateStats() {
        const total = this.books.length;
        const read = this.books.filter(b => b.read).length;
        const avgRating = total > 0 ? 
            (this.books.reduce((sum, b) => sum + (b.rating || 0), 0) / total).toFixed(1) : 0;
        
        document.getElementById('totalBooks').textContent = total;
        document.getElementById('readBooks').textContent = read;
        document.getElementById('avgRating').textContent = avgRating;
    },
    
    showHome() {
        this.hideAllPages();
        document.getElementById('homePage').classList.add('active');
    },
    
    showLibrary() {
        this.renderLibrary();
        this.updateStats();
        this.hideAllPages();
        document.getElementById('libraryPage').classList.add('active');
    },
    
    showSettings() {
        this.hideAllPages();
        document.getElementById('settingsPage').classList.add('active');
        
        // Підсвітка активної теми
        document.querySelectorAll('.theme-option').forEach(btn => {
            if (btn.dataset.theme === this.theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Підсвітка активної мови
        document.querySelectorAll('.lang-option').forEach(btn => {
            if (btn.dataset.lang === this.language) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },
    
    hideAllPages() {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
    },
    
    renderLibrary() {
        const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const container = document.getElementById('booksList');
        
        let filteredBooks = [...this.books];
        if (searchText) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchText) || 
                book.author.toLowerCase().includes(searchText)
            );
        }
        
        filteredBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        if (filteredBooks.length === 0) {
            container.innerHTML = '<div class="empty-state">📭 Немає книг<br><small>Натисніть + щоб додати</small></div>';
            return;
        }
        
        container.innerHTML = filteredBooks.map(book => `
            <div class="book-card" onclick="app.openBook(${book.id})">
                <div class="book-cover-mini">${book.cover ? '📖' : '📕'}</div>
                <div class="book-info">
                    <div class="book-title">${this.escapeHtml(book.title)}</div>
                    <div class="book-author">${this.escapeHtml(book.author)}</div>
                    <div class="book-rating">⭐ ${book.rating || 0}/10</div>
                </div>
                <div class="book-status-icon">${book.read ? '✅' : '📖'}</div>
                <button class="delete-btn" onclick="event.stopPropagation(); app.deleteBook(${book.id})">✕</button>
            </div>
        `).join('');
        
        this.updateStats();
    },
    
    openBook(id) {
        this.currentBook = this.books.find(b => b.id === id);
        if (!this.currentBook) return;
        
        document.getElementById('bookDetailTitle').textContent = this.currentBook.title;
        document.getElementById('bookDetailAuthor').textContent = this.currentBook.author;
        document.getElementById('bookDetailReview').textContent = this.currentBook.review || 'Немає рецензії';
        
        // Рендер зірок
        this.renderStars(this.currentBook.rating || 0);
        
        // Обкладинка
        const coverDiv = document.getElementById('bookDetailCover');
        if (this.currentBook.cover && this.currentBook.cover.startsWith('data:')) {
            coverDiv.innerHTML = `<img src="${this.currentBook.cover}" style="max-width:180px;max-height:240px;border-radius:10px;">`;
        } else {
            coverDiv.innerHTML = '📕';
        }
        
        this.hideAllPages();
        document.getElementById('bookPage').classList.add('active');
    },
    
    renderStars(rating) {
        const container = document.getElementById('bookDetailRating');
        const ratingValue = document.getElementById('ratingValue');
        ratingValue.textContent = `${rating}/10`;
        
        container.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.textContent = i <= rating ? '⭐' : '☆';
            star.onclick = (e) => {
                e.stopPropagation();
                this.setRating(i);
            };
            container.appendChild(star);
        }
    },
    
    setRating(rating) {
        if (this.currentBook) {
            this.currentBook.rating = rating;
            this.saveData();
            this.renderStars(rating);
            this.renderLibrary();
        }
    },
    
    markRead() {
        if (this.currentBook) {
            this.currentBook.read = true;
            this.saveData();
            this.openBook(this.currentBook.id);
            this.renderLibrary();
        }
    },
    
    markUnread() {
        if (this.currentBook) {
            this.currentBook.read = false;
            this.saveData();
            this.openBook(this.currentBook.id);
            this.renderLibrary();
        }
    },
    
    editBook() {
        this.editBookId = this.currentBook.id;
        document.getElementById('dialogTitle').textContent = '✏️ Редагувати книгу';
        document.getElementById('dialogTitleInput').value = this.currentBook.title;
        document.getElementById('dialogAuthorInput').value = this.currentBook.author;
        document.getElementById('dialogReviewInput').value = this.currentBook.review || '';
        document.getElementById('dialogRatingInput').value = this.currentBook.rating || 0;
        
        // Рендер зірок в діалозі
        this.renderDialogStars(this.currentBook.rating || 0);
        
        document.getElementById('bookDialog').style.display = 'flex';
    },
    
    renderDialogStars(rating) {
        const container = document.getElementById('dialogStars');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const star = document.createElement('span');
            star.textContent = i <= rating ? '⭐' : '☆';
            star.style.cursor = 'pointer';
            star.style.fontSize = '24px';
            star.onclick = () => {
                document.getElementById('dialogRatingInput').value = i;
                this.renderDialogStars(i);
            };
            container.appendChild(star);
        }
    },
    
    showAddBookDialog() {
        this.editBookId = null;
        document.getElementById('dialogTitle').textContent = '➕ Додати книгу';
        document.getElementById('dialogTitleInput').value = '';
        document.getElementById('dialogAuthorInput').value = '';
        document.getElementById('dialogReviewInput').value = '';
        document.getElementById('dialogRatingInput').value = 5;
        this.renderDialogStars(5);
        document.getElementById('bookDialog').style.display = 'flex';
    },
    
    saveBookDialog() {
        const title = document.getElementById('dialogTitleInput').value.trim();
        const author = document.getElementById('dialogAuthorInput').value.trim();
        const review = document.getElementById('dialogReviewInput').value;
        const rating = parseInt(document.getElementById('dialogRatingInput').value) || 0;
        
        if (!title || !author) {
            alert('Будь ласка, заповніть назву та автора!');
            return;
        }
        
        if (this.editBookId === null) {
            // Нова книга
            const newBook = {
                id: Date.now(),
                title: title,
                author: author,
                review: review,
                cover: '',
                read: false,
                rating: Math.min(10, Math.max(0, rating))
            };
            this.books.push(newBook);
        } else {
            // Редагування
            const book = this.books.find(b => b.id === this.editBookId);
            if (book) {
                book.title = title;
                book.author = author;
                book.review = review;
                book.rating = Math.min(10, Math.max(0, rating));
                this.currentBook = book;
            }
        }
        
        this.saveData();
        this.closeDialog();
        this.renderLibrary();
    },
    
    deleteBook(id) {
        if (confirm('❓ Видалити цю книгу?')) {
            this.books = this.books.filter(b => b.id !== id);
            this.saveData();
            this.renderLibrary();
            if (this.currentBook && this.currentBook.id === id) {
                this.showLibrary();
            }
        }
    },
    
    changeCover() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && this.currentBook) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.currentBook.cover = event.target.result;
                    this.saveData();
                    this.openBook(this.currentBook.id);
                    this.renderLibrary();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    },
    
    filterBooks() {
        this.renderLibrary();
    },
    
    closeDialog() {
        document.getElementById('bookDialog').style.display = 'none';
    },
    
    setTheme(theme) {
        this.theme = theme;
        this.applyTheme();
        this.saveData();
        this.showSettings();
    },
    
    applyTheme() {
        if (this.theme === 'light') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        }
    },
    
    setLanguage(lang) {
        this.language = lang;
        this.saveData();
        this.showSettings();
        // Тут можна додати переклад інтерфейсу
    },
    
    exportData() {
        const dataStr = JSON.stringify(this.books, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookshelf_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('✅ Бібліотеку експортовано!');
    },
    
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (Array.isArray(imported)) {
                        this.books = imported;
                        this.saveData();
                        this.renderLibrary();
                        alert('✅ Бібліотеку імпортовано!');
                    } else {
                        alert('❌ Невірний формат файлу');
                    }
                } catch(e) {
                    alert('❌ Помилка читання файлу');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },
    
    clearAllData() {
        if (confirm('⚠️ ВСІ ДАНІ БУДУТЬ ВИДАЛЕНІ! Ви впевнені?')) {
            this.books = [];
            this.saveData();
            this.renderLibrary();
            this.showLibrary();
            alert('🗑 Всі дані очищено');
        }
    },
    
    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, (m) => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
};

// Запуск
window.addEventListener('DOMContentLoaded', () => app.init());
