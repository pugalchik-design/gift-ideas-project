let giftsData = [];

const filterForm = document.getElementById('filter-form');
const giftsGrid = document.getElementById('gifts-grid');
const countBadge = document.getElementById('count-badge');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const emptyMessage = document.getElementById('empty-message');
const resetBtn = document.getElementById('reset-btn');

async function initApp() {
    try {
        const response = await fetch('gifts.json');
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        giftsData = await response.json();
        
        loader.classList.add('hidden');
        giftsGrid.classList.remove('hidden');
        
        renderGifts(giftsData);
        setupEventListeners();
        
    } catch (error) {
        console.error('Ошибка при инициализации проекта:', error);
        loader.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

function renderGifts(items) {
    giftsGrid.innerHTML = '';
    countBadge.textContent = items.length;

    if (items.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    }

    emptyMessage.classList.add('hidden');

    items.forEach(gift => {
        const card = document.createElement('article');
        card.className = 'gift-card';
        
        card.innerHTML = `
            <img src="${gift.image}" alt="${gift.name}" class="gift-image" loading="lazy">
            <div class="gift-info">
                <h3 class="gift-title">${gift.name}</h3>
                <p class="gift-desc">${gift.description}</p>
                <div class="gift-tags">
                    <span class="tag">${translateAttribute(gift.category)}</span>
                    <span class="tag">${translateAttribute(gift.budget)}</span>
                </div>
            </div>
        `;
        giftsGrid.appendChild(card);
    });
}

// Вспомогательный метод для перевода тегов
function translateAttribute(val) {
    const dictionary = {
        'gadgets': 'Гаджет', 'creative': 'Творчество', 'games': 'Игры', 'style': 'Стиль',
        'low': 'Бюджетно', 'medium': 'Средний', 'high': 'Премиум'
    };
    return dictionary[val] || val;
}

function filterGifts() {
    const selectedCategory = document.getElementById('category').value;
    const selectedAge = document.getElementById('age').value;
    const selectedBudget = document.getElementById('budget').value;

    const filtered = giftsData.filter(gift => {
        const matchCategory = selectedCategory === 'all' || gift.category === selectedCategory;
        const matchAge = selectedAge === 'all' || gift.age === selectedAge || gift.age === 'all';
        const matchBudget = selectedBudget === 'all' || gift.budget === selectedBudget;

        return matchCategory && matchAge && matchBudget;
    });

    renderGifts(filtered);
}

function setupEventListeners() {
    filterForm.addEventListener('change', filterGifts);
    
    resetBtn.addEventListener('click', () => {
        filterForm.reset();
        renderGifts(giftsData);
    });
}

document.addEventListener('DOMContentLoaded', initApp);
