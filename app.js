const app = {
    books: [],
    currentBook: null,
    editBookId: null,
    language: 'uk',
    theme: 'dark',
    
    translations: {
        uk: {
            app_title: "BookShelf Pro",
            my_library: "Моя бібліотека",
            settings: "Налаштування",
            search: "🔍 Пошук книги...",
            no_books: "📭 Немає книг",
            add_first: "Натисніть + щоб додати",
            add_book: "Додати книгу",
            edit_book: "Редагувати книгу",
            title: "Назва книги *",
            author: "Автор *",
            review: "Рецензія (необов'язково)",
            rating: "⭐ Рейтинг:",
            cancel: "Скасувати",
            save: "Зберегти",
            read: "✅ Прочитано",
            unread: "📖 Не прочитано",
            review_section: "📝 Рецензія",
            no_review: "Немає рецензії",
            edit: "✏️ Редагувати",
            change_cover: "🖼 Обкладинка",
            theme_title: "🌙 Тема оформлення",
            dark_theme: "🌙 Темна",
            light_theme: "☀️ Світла",
            language_title: "🌐 Мова",
            ukrainian: "🇺🇦 Українська",
            english: "🇬🇧 English",
            data_title: "💾 Дані",
            export: "📤 Експорт бібліотеки",
            import: "📥 Імпорт бібліотеки",
            clear: "🗑 Очистити всі дані",
            delete_confirm: "❓ Видалити цю книгу?",
            clear_confirm: "⚠️ ВСІ ДАНІ БУДУТЬ ВИДАЛЕНІ! Ви впевнені?",
            export_success: "✅ Бібліотеку експортовано!",
            import_success: "✅ Бібліотеку імпортовано!",
            import_error: "❌ Невірний формат файлу",
            fill_fields: "Будь ласка, заповніть назву та автора!"
        },
        en: {
            app_title: "BookShelf Pro",
            my_library: "My Library",
            settings: "Settings",
            search: "🔍 Search books...",
            no_books: "📭 No books",
            add_first: "Press + to add",
            add_book: "Add book",
            edit_book: "Edit book",
            title: "Title *",
            author: "Author *",
            review: "Review (optional)",
            rating: "⭐ Rating:",
            cancel: "Cancel",
            save: "Save",
            read: "✅ Read",
            unread: "📖 Unread",
            review_section: "📝 Review",
            no_review: "No review",
            edit: "✏️ Edit",
            change_cover: "🖼 Change cover",
            theme_title: "🌙 Theme",
            dark_theme: "🌙 Dark",
            light_theme: "☀️ Light",
            language_title: "🌐 Language",
            ukrainian: "🇺🇦 Ukrainian",
            english: "🇬🇧 English",
            data_title: "💾 Data",
            export: "📤 Export library",
            import: "📥 Import library",
            clear: "🗑 Clear all data",
            delete_confirm: "❓ Delete this book?",
            clear_confirm: "⚠️ ALL DATA WILL BE DELETED! Are you sure?",
            export_success: "✅ Library exported!",
            import_success: "✅ Library imported!",
            import_error: "❌ Invalid file format",
            fill_fields: "Please fill in title and author!"
        }
    },
    
    t(key) {
        return this.translations[this.language][key] || key;
    },
    
    init() {
        this.loadData();
        this.applyTheme();
        this.updateAllTexts();
        this.renderLibrary();
        this.showHome();
    },
    
    loadData() {
        const savedBooks = localStorage.getItem('bookshelf_books');
        if (savedBooks) {
            this.books = JSON.parse(savedBooks);
        } else {
            this.books = this.getDemoBooks();
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
    
    updateAllTexts() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[this.language][key]) {
                if (el.tagName === 'INPUT' && el.placeholder) {
                    el.placeholder = this.t(key);
                } else if (el.tagName === 'BUTTON' && el.innerText) {
                    el.innerText = this.t(key);
                } else {
                    el.innerText = this.t(key);
                }
            }
        });
        
        document.title = this.t('app_title');
        this.updateStats();
    },
    
    updateStats() {
        const total = this.books.length;
        const read = this.books.filter(b => b.read).length;
        const avgRating = total > 0 ? 
            (this.books.reduce((sum, b) => sum + (b.rating || 0), 0) / total).toFixed(1) : 0;
        
        const totalEl = document.getElementById('totalBooks');
        const readEl = document.getElementById('readBooks');
        const avgEl = document.getElementById('avgRating');
        
        if (totalEl) totalEl.textContent = total;
        if (readEl) readEl.textContent = read;
        if (avgEl) avgEl.textContent = avgRating;
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
        this.updateAllTexts();
        
        document.querySelectorAll('.theme-option').forEach(btn => {
            if (btn.dataset.theme === this.theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
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
        
        if (!container) return;
        
        let filteredBooks = [...this.books];
        if (searchText) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(searchText) || 
                book.author.toLowerCase().includes(searchText)
            );
        }
        
        filteredBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        if (filteredBooks.length === 0) {
            container.innerHTML = `<div class="empty-state">${this.t('no_books')}<br><small>${this.t('add_first')}</small></div>`;
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
        document.getElementById('bookDetailReview').textContent = this.currentBook.review || this.t('no_review');
        
        const readBtn = document.getElementById('markReadBtn');
        const unreadBtn = document.getElementById('markUnreadBtn');
        const editBtn = document.getElementById('editBookBtn');
        const coverBtn = document.getElementById('changeCoverBtn');
        
        if (readBtn) readBtn.textContent = this.t('read');
        if (unreadBtn) unreadBtn.textContent = this.t('unread');
        if (editBtn) editBtn.textContent = this.t('edit');
        if (coverBtn) coverBtn.textContent = this.t('change_cover');
        
        this.renderStars(this.currentBook.rating || 0);
        
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
        if (ratingValue) ratingValue.textContent = `${rating}/10`;
        
        if (!container) return;
        
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
        document.getElementById('dialogTitle').textContent = this.t('edit_book');
        document.getElementById('dialogTitleInput').value = this.currentBook.title;
        document.getElementById('dialogAuthorInput').value = this.currentBook.author;
        document.getElementById('dialogReviewInput').value = this.currentBook.review || '';
        document.getElementById('dialogRatingInput').value = this.currentBook.rating || 0;
        
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
        document.getElementById('dialogTitle').textContent = this.t('add_book');
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
            alert(this.t('fill_fields'));
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
                rating: Math.min(10, Math.max(0, rating))
            };
            this.books.push(newBook);
        } else {
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
        if (confirm(this.t('delete_confirm'))) {
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
        this.updateAllTexts();
        this.renderLibrary();
        this.showSettings();
        
        if (this.currentBook) {
            this.openBook(this.currentBook.id);
        }
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
        alert(this.t('export_success'));
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
                        alert(this.t('import_success'));
                    } else {
                        alert(this.t('import_error'));
                    }
                } catch(e) {
                    alert(this.t('import_error'));
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },
    
    clearAllData() {
        if (confirm(this.t('clear_confirm'))) {
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
            if (m === '&')
