let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "Stay hungry, stay foolish.", category: "Life" },
    { text: "The best way to predict the future is to create it.", category: "Future" }
];

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${quote.text}"`;
    quoteDisplay.appendChild(quoteText);
    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `- ${quote.category}`;
    quoteDisplay.appendChild(quoteCategory);
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function showRandomQuote() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = quotes.filter(quote => selectedCategory === 'all' || quote.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        displayQuote(quote);
    } else {
        document.getElementById('quoteDisplay').innerHTML = '<p>No quotes available for this category.</p>';
    }
}

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastFilter', selectedCategory);
    showRandomQuote();
}

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
    if (newQuoteText && newQuoteCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };
        quotes.push(newQuote);
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        saveQuotes();
        populateCategories();
        filterQuotes();
        postQuoteToServer(newQuote);
        alert('Quote added successfully!');
    }
}

function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('importFile').addEventListener('change', function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
});

async function postQuoteToServer(quote) {
    try {
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(quote),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverPosts = await response.json();
        
        return serverPosts.map(post => ({
            text: post.title,
            category: 'Server'
        }));
    } catch (error) {
        return [];
    }
}

async function syncQuotes() {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Syncing quotes...';

    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    const mergedQuotes = [...localQuotes];

    for (const serverQuote of serverQuotes) {
        const exists = mergedQuotes.some(localQuote => localQuote.text === serverQuote.text);
        if (!exists) {
            mergedQuotes.push(serverQuote);
        }
    }

    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    statusDiv.textContent = 'Quotes synced with server!';
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    populateCategories();
    const lastFilter = localStorage.getItem('lastFilter');
    if (lastFilter) {
        document.getElementById('categoryFilter').value = lastFilter;
    }
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
    document.getElementById('syncQuotes').addEventListener('click', syncQuotes);
    
    setInterval(syncQuotes, 30000);

    showRandomQuote();
});
