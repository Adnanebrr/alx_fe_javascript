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

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    quoteDisplay.innerHTML = '';

    const quoteText = document.createElement('p');
    quoteText.textContent = `"${quote.text}"`;
    quoteDisplay.appendChild(quoteText);

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `- ${quote.category}`;
    quoteDisplay.appendChild(quoteCategory);

    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function createAddQuoteForm() {
    
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
        showRandomQuote();
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
      showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
});

document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
    showRandomQuote();
});
