const app = {
    books: [],
    currentBook: null,
    editBookId: null,
    language: 'uk',
    theme: 'dark',
    sortBy: 'rating',
    
    translations: {
        uk: {
            home_title: "📚 BookShelf Pro",
            library_btn: "Моя бібліотека",
            settings_btn: "⚙ Налаштування",
            library_title: "Моя бібліотека",
            settings_title: "Налаштування",
            search: "🔍 Пошук книги...",
            no_books: "📭 Немає книг",
            add_first: "Натисніть + щоб додати",
            add_book: "Додати книгу",
            edit_book: "Редагувати книгу",
            title: "Назва книги *",
            author: "Автор *",
            review: "Рецензія",
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
            export: "📤 Експорт",
            import: "📥 Імпорт",
            clear: "🗑 Очистити всі дані",
            delete_confirm: "❓ Видалити цю книгу?",
            clear_confirm: "⚠️ ВСІ ДАНІ БУДУТЬ ВИДАЛЕНІ!",
            fill_fields: "Заповніть назву та автора",
            sort_by: "📊 Сортувати:",
            sort_rating: "⭐ За рейтингом",
            sort_title: "📝 За назвою",
            sort_date: "📅 За датою",
            back: "← Назад"
        },
        en: {
            home_title: "📚 BookShelf Pro",
            library_btn: "My Library",
            settings_btn: "⚙ Settings",
            library_title: "My Library",
            settings_title: "Settings",
            search: "🔍 Search books...",
            no_books: "📭 No books",
            add_first: "Press + to add",
            add_book: "Add book",
            edit_book: "Edit book",
            title: "Title *",
            author: "Author *",
            review: "Review",
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
            export: "📤 Export",
            import: "📥 Import",
            clear: "🗑 Clear all data",
            delete_confirm: "❓ Delete this book?",
            clear_confirm: "⚠️ ALL DATA WILL BE DELETED!",
            fill_fields: "Please fill title and author",
            sort_by: "📊 Sort by:",
            sort_rating: "⭐ By rating",
            sort_title: "📝 By title",
            sort_date: "📅 By date",
            back: "← Back"
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
            this.books = [];
        }
        
        const savedTheme = localStorage.getItem('bookshelf_theme');
        if (savedTheme) this.theme = savedTheme;
        
        const savedLang = localStorage.getItem('bookshelf_lang');
        if (savedLang) this.language = savedLang;
        
        const savedSort = localStorage.getItem('bookshelf_sort');
        if (savedSort) this.sortBy = savedSort;
    },
    
    saveData() {
        localStorage.setItem('bookshelf_books', JSON.stringify(this.books));
        localStorage.setItem('bookshelf_theme', this.theme);
        localStorage.setItem('bookshelf_lang', this.language);
        localStorage.setItem('bookshelf_sort', this.sortBy);
        this.updateStats();
    },
    
    updateAllTexts() {
        document.querySelector('.main-title').textContent = this.t('home_title');
        
        const btns = document.querySelectorAll('.big-btn');
        if (btns[0]) btns[0].textContent = this.t('library_btn');
        if (btns[1]) btns[1].textContent = this.t('settings_btn');
        
        const headers = document.querySelectorAll('h2');
        if (headers[0]) headers[0].textContent = this.t('library_title');
        if (headers[1]) headers[1].textContent = this.t('settings_title');
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.placeholder = this.t('search');
        
        const sortLabel = document.querySelector('.sort-container label');
        if (sortLabel) sortLabel.textContent = this.t('sort_by');
        
        const sortOptions = document.querySelectorAll('#sortSelect option');
        if (sortOptions[0]) sortOptions[0].textContent = this.t('sort_rating');
        if (sortOptions[1]) sortOptions[1].textContent = this.t('sort_title');
        if (sortOptions[2]) sortOptions[2].textContent = this.t('sort_date');
        
        const themeLabel = document.querySelector('.settings-item:first-child label');
        if (themeLabel) themeLabel.textContent = this.t('theme_title');
        
        const themeBtns = document.querySelectorAll('.theme-option');
        if (themeBtns[0]) themeBtns[0].textContent = this.t('dark_theme');
        if (themeBtns[1]) themeBtns[1].textContent = this.t('light_theme');
        
        const langLabel = document.querySelector('.settings-item:nth-child(2) label');
        if (langLabel) langLabel.textContent = this.t('language_title');
        
        const langBtns = document.querySelectorAll('.lang-option');
        if (langBtns[0]) langBtns[0].textContent = this.t('ukrainian');
        if (langBtns[1]) langBtns[1].textContent = this.t('english');
        
        const dataLabel = document.querySelector('.settings-item:nth-child(3) label');
        if (dataLabel) dataLabel.textContent = this.t('data_title');
        
        const dataBtns = document.querySelectorAll('.danger-btn');
        if (dataBtns[0]) dataBtns[0].textContent = this.t('export');
        if (dataBtns[1]) dataBtns[1].textContent = this.t('import');
        if (dataBtns[2]) dataBtns[2].textContent = this.t('clear');
        
        const backBtns = document.querySelectorAll('.back-icon, .icon-btn:first-child');
        backBtns.forEach(btn => {
            if (btn.textContent === '←' || btn.textContent === '← Назад') {
                btn.textContent = this.t('back');
            }
        });
        
        const dialogTitle = document.getElementById('dialogTitle');
        if (dialogTitle && dialogTitle.textContent.includes('Додати')) {
            dialogTitle.textContent = this.t('add_book');
        }
        
        this.updateStats();
    },
    
    updateStats() {
        const total = this.books.length;
        const read = this.books.filter(b => b.read).length;
        const avgRating = total > 0 ? (this.books.reduce((sum, b) => sum + (b.rating || 0), 0) / total).toFixed(1) : 0;
        
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
    
    setSort(sortBy) {
        this.sortBy = sortBy;
        this.saveData();
        this.renderLibrary();
    },
    
    getCoverImage(book) {
        if (book.cover && book.cover.startsWith('data:')) {
            return `<img src="${book.cover}" style="width:50px;height:70px;object-fit:cover;border-radius:8px;">`;
        }
        return '📕';
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
        
        if (this.sortBy === 'rating') {
            filteredBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (this.sortBy === 'title') {
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (this.sortBy === 'date') {
            filteredBooks.sort((a, b) => (b.created || 0) - (a.created || 0));
        }
        
        if (filteredBooks.length === 0) {
            container.innerHTML = `<div class="empty-state">${this.t('no_books')}<br><small>${this.t('add_first')}</small></div>`;
            return;
        }
        
        container.innerHTML = filteredBooks.map(book => `
            <div class="book-card" onclick="app.openBook(${book.id})">
                <div class="book-cover-mini">${this.getCoverImage(book)}</div>
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
        
        const readBtn = document.querySelector('#bookPage .read-btn');
        const unreadBtn = document.querySelector('#bookPage .unread-btn');
        const editBtn = document.querySelector('#bookPage .action-btn:first-child');
        const coverBtn = document.querySelector('#bookPage .action-btn:last-child');
        const reviewHeader = document.querySelector('#bookPage .review-section h3');
        
        if (readBtn) readBtn.innerHTML = this.t('read');
        if (unreadBtn) unreadBtn.innerHTML = this.t('unread');
        if (editBtn) editBtn.innerHTML = this.t('edit');
        if (coverBtn) coverBtn.innerHTML = this.t('change_cover');
        if (reviewHeader) reviewHeader.innerHTML = this.t('review_section');
        
        this.renderStars(this.currentBook.rating || 0);
        
        const coverDiv = document.getElementById('bookDetailCover');
        if (this.currentBook.cover && this.currentBook.cover.startsWith('data:')) {
            coverDiv.innerHTML = `<img src="${this.currentBook.cover}" style="max-width:180px;max-height:240px;border-radius:10px;object-fit:cover;">`;
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
        
        const ratingLabel = document.querySelector('.rating-input label');
        if (ratingLabel) ratingLabel.textContent = this.t('rating');
        
        const cancelBtn = document.querySelector('.cancel-btn');
        const saveBtn = document.querySelector('.save-btn');
        if (cancelBtn) cancelBtn.textContent = this.t('cancel');
        if (saveBtn) saveBtn.textContent = this.t('save');
        
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
        
        const ratingLabel = document.querySelector('.rating-input label');
        if (ratingLabel) ratingLabel.textContent = this.t('rating');
        
        const cancelBtn = document.querySelector('.cancel-btn');
        const saveBtn = document.querySelector('.save-btn');
        if (cancelBtn) cancelBtn.textContent = this.t('cancel');
        if (saveBtn) saveBtn.textContent = this.t('save');
        
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
                rating: Math.min(10, Math.max(0, rating)),
                created: Date.now()
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
        if (this.theme === 'light') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        }
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
        alert('✅ ' + (this.language === 'uk' ? 'Експорт виконано' : 'Export done'));
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
                        alert('✅ ' + (this.language === 'uk' ? 'Імпорт виконано' : 'Import done'));
                    } else {
                        alert('❌ ' + (this.language === 'uk' ? 'Невірний формат' : 'Invalid format'));
                    }
                } catch(e) {
                    alert('❌ ' + (this.language === 'uk' ? 'Помилка читання' : 'Read error'));
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

app.init();
