const app = {
    books: [],
    currentBook: null,
    language: 'uk',
    theme: 'dark',
    
    init() {
        this.loadData();
        this.applyTheme();
        this.renderLibrary();
        this.showHome();
        
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = this.language;
        }
    },
    
    loadData() {
        const saved = localStorage.getItem('bookshelf_books');
        if (saved) {
            this.books = JSON.parse(saved);
        } else {
            this.books = [];
        }
        
        const savedTheme = localStorage.getItem('bookshelf_theme');
        if (savedTheme) this.theme = savedTheme;
        
        const savedLang = localStorage.getItem('bookshelf_lang');
        if (savedLang) this.language = savedLang;
    },
    
    saveData() {
        localStorage.setItem('bookshelf_books', JSON.stringify(this.books));
        localStorage.setItem('bookshelf_theme', this.theme);
        localStorage.setItem('bookshelf_lang', this.language);
    },
    
    updateLanguage() {
        if (this.language === 'uk') {
            document.querySelector('.main-title').textContent = '📚 BookShelf Pro';
            document.querySelectorAll('.big-btn')[0].textContent = 'Моя бібліотека';
            document.querySelectorAll('.big-btn')[1].textContent = '⚙ Налаштування';
            document.querySelector('#libraryPage h2').textContent = 'Моя бібліотека';
            document.querySelector('#settingsPage h2').textContent = 'Налаштування';
            document.getElementById('searchInput').placeholder = '🔍 Пошук книги...';
            document.querySelector('.sort-container label').textContent = '📊 Сортувати:';
            document.querySelectorAll('#sortSelect option')[0].textContent = '⭐ За рейтингом';
            document.querySelectorAll('#sortSelect option')[1].textContent = '📝 За назвою';
            document.querySelectorAll('#sortSelect option')[2].textContent = '📅 За датою';
            document.querySelector('.settings-item:first-child label').textContent = '🌙 Тема оформлення';
            document.querySelectorAll('.theme-option')[0].textContent = '🌙 Темна';
            document.querySelectorAll('.theme-option')[1].textContent = '☀️ Світла';
            document.querySelector('.settings-item:nth-child(2) label').textContent = '🌐 Мова';
            document.querySelectorAll('.lang-option')[0].textContent = '🇺🇦 Українська';
            document.querySelectorAll('.lang-option')[1].textContent = '🇬🇧 English';
            document.querySelector('.settings-item:nth-child(3) label').textContent = '💾 Дані';
            document.querySelectorAll('.danger-btn')[0].textContent = '📤 Експорт';
            document.querySelectorAll('.danger-btn')[1].textContent = '📥 Імпорт';
            document.querySelectorAll('.danger-btn')[2].textContent = '🗑 Очистити всі дані';
        } else {
            document.querySelector('.main-title').textContent = '📚 BookShelf Pro';
            document.querySelectorAll('.big-btn')[0].textContent = 'My Library';
            document.querySelectorAll('.big-btn')[1].textContent = '⚙ Settings';
            document.querySelector('#libraryPage h2').textContent = 'My Library';
            document.querySelector('#settingsPage h2').textContent = 'Settings';
            document.getElementById('searchInput').placeholder = '🔍 Search books...';
            document.querySelector('.sort-container label').textContent = '📊 Sort by:';
            document.querySelectorAll('#sortSelect option')[0].textContent = '⭐ By rating';
            document.querySelectorAll('#sortSelect option')[1].textContent = '📝 By title';
            document.querySelectorAll('#sortSelect option')[2].textContent = '📅 By date';
            document.querySelector('.settings-item:first-child label').textContent = '🌙 Theme';
            document.querySelectorAll('.theme-option')[0].textContent = '🌙 Dark';
            document.querySelectorAll('.theme-option')[1].textContent = '☀️ Light';
            document.querySelector('.settings-item:nth-child(2) label').textContent = '🌐 Language';
            document.querySelectorAll('.lang-option')[0].textContent = '🇺🇦 Ukrainian';
            document.querySelectorAll('.lang-option')[1].textContent = '🇬🇧 English';
            document.querySelector('.settings-item:nth-child(3) label').textContent = '💾 Data';
            document.querySelectorAll('.danger-btn')[0].textContent = '📤 Export';
            document.querySelectorAll('.danger-btn')[1].textContent = '📥 Import';
            document.querySelectorAll('.danger-btn')[2].textContent = '🗑 Clear all data';
        }
        
        this.renderLibrary();
    },
    
    showHome() {
        document.getElementById('homePage').classList.add('active');
        document.getElementById('libraryPage').classList.remove('active');
        document.getElementById('settingsPage').classList.remove('active');
        document.getElementById('bookPage').classList.remove('active');
    },
    
    showLibrary() {
        this.renderLibrary();
        document.getElementById('homePage').classList.remove('active');
        document.getElementById('libraryPage').classList.add('active');
        document.getElementById('settingsPage').classList.remove('active');
        document.getElementById('bookPage').classList.remove('active');
    },
    
    showSettings() {
        document.getElementById('homePage').classList.remove('active');
        document.getElementById('libraryPage').classList.remove('active');
        document.getElementById('settingsPage').classList.add('active');
        document.getElementById('bookPage').classList.remove('active');
        this.updateLanguage();
    },
    
    renderLibrary() {
        const container = document.getElementById('booksList');
        
        if (this.books.length === 0) {
            container.innerHTML = '<div class="empty-state">📭 Немає книг<br><small>Натисніть + щоб додати</small></div>';
            return;
        }
        
        container.innerHTML = this.books.map(book => `
            <div class="book-card" onclick="app.openBook(${book.id})">
                <div class="book-cover-mini">📕</div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-rating">⭐ ${book.rating || 0}/10</div>
                </div>
                <div class="book-status-icon">${book.read ? '✅' : '📖'}</div>
                <button class="delete-btn" onclick="event.stopPropagation(); app.deleteBook(${book.id})">✕</button>
            </div>
        `).join('');
        
        const total = this.books.length;
        const read = this.books.filter(b => b.read).length;
        document.getElementById('totalBooks').textContent = total;
        document.getElementById('readBooks').textContent = read;
    },
    
    openBook(id) {
        this.currentBook = this.books.find(b => b.id === id);
        if (!this.currentBook) return;
        
        document.getElementById('bookDetailTitle').textContent = this.currentBook.title;
        document.getElementById('bookDetailAuthor').textContent = this.currentBook.author;
        document.getElementById('bookDetailReview').textContent = this.currentBook.review || 'Немає рецензії';
        
        document.getElementById('homePage').classList.remove('active');
        document.getElementById('libraryPage').classList.remove('active');
        document.getElementById('settingsPage').classList.remove('active');
        document.getElementById('bookPage').classList.add('active');
    },
    
    markRead() {
        if (this.currentBook) {
            this.currentBook.read = true;
            this.saveData();
            this.renderLibrary();
            this.openBook(this.currentBook.id);
        }
    },
    
    markUnread() {
        if (this.currentBook) {
            this.currentBook.read = false;
            this.saveData();
            this.renderLibrary();
            this.openBook(this.currentBook.id);
        }
    },
    
    editBook() {
        this.editBookId = this.currentBook.id;
        document.getElementById('dialogTitle').textContent = 'Редагувати книгу';
        document.getElementById('dialogTitleInput').value = this.currentBook.title;
        document.getElementById('dialogAuthorInput').value = this.currentBook.author;
        document.getElementById('dialogReviewInput').value = this.currentBook.review || '';
        document.getElementById('dialogRatingInput').value = this.currentBook.rating || 0;
        document.getElementById('bookDialog').style.display = 'flex';
    },
    
    showAddBookDialog() {
        this.editBookId = null;
        document.getElementById('dialogTitle').textContent = 'Додати книгу';
        document.getElementById('dialogTitleInput').value = '';
        document.getElementById('dialogAuthorInput').value = '';
        document.getElementById('dialogReviewInput').value = '';
        document.getElementById('dialogRatingInput').value = 5;
        document.getElementById('bookDialog').style.display = 'flex';
    },
    
    saveBookDialog() {
        const title = document.getElementById('dialogTitleInput').value.trim();
        const author = document.getElementById('dialogAuthorInput').value.trim();
        const review = document.getElementById('dialogReviewInput').value;
        const rating = parseInt(document.getElementById('dialogRatingInput').value) || 0;
        
        if (!title || !author) {
            alert('Заповніть назву та автора!');
            return;
        }
        
        if (this.editBookId === null) {
            const newBook = {
                id: Date.now(),
                title: title,
                author: author,
                review: review,
                cover: '',
                read: false,
                rating: rating,
                created: Date.now()
            };
            this.books.push(newBook);
        } else {
            const book = this.books.find(b => b.id === this.editBookId);
            if (book) {
                book.title = title;
                book.author = author;
                book.review = review;
                book.rating = rating;
            }
        }
        
        this.saveData();
        this.closeDialog();
        this.renderLibrary();
    },
    
    deleteBook(id) {
        if (confirm('Видалити цю книгу?')) {
            this.books = this.books.filter(b => b.id !== id);
            this.saveData();
            this.renderLibrary();
            if (this.currentBook && this.currentBook.id === id) {
                this.showLibrary();
            }
        }
    },
    
    changeCover() {
        alert('Функція зміни обкладинки буде додана пізніше');
    },
    
    filterBooks() {
        this.renderLibrary();
    },
    
    closeDialog() {
        document.getElementById('bookDialog').style.display = 'none';
    },
    
    setTheme(theme) {
        this.theme = theme;
        if (theme === 'light') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        }
        this.saveData();
        this.updateLanguage();
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
        this.updateLanguage();
        this.showSettings();
    },
    
    setSort(sortBy) {
        this.sortBy = sortBy;
        this.renderLibrary();
    },
    
    exportData() {
        const dataStr = JSON.stringify(this.books, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookshelf_backup.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('Експорт виконано');
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
                        alert('Імпорт виконано');
                    } else {
                        alert('Невірний формат');
                    }
                } catch(e) {
                    alert('Помилка читання');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },
    
    clearAllData() {
        if (confirm('ВСІ ДАНІ БУДУТЬ ВИДАЛЕНІ! Ви впевнені?')) {
            this.books = [];
            this.saveData();
            this.renderLibrary();
            this.showLibrary();
        }
    }
};

app.init();
