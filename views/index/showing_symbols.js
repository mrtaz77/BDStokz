// const stockInput = document.getElementById('stockInput');
// const suggestionsList = document.getElementById('suggestions');
// const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols

// stockInput.addEventListener('input', updateSuggestions);

// function updateSuggestions() {
//   const input = stockInput.value.trim().toUpperCase();

//   if (input === '') {
//     suggestionsList.innerHTML = '';
//     return;
//   }

//   const filteredSuggestions = allSymbols.filter(symbol => symbol.startsWith(input));
//   displaySuggestions(filteredSuggestions);
// }

// function displaySuggestions(suggestions) {
//   suggestionsList.innerHTML = '';

//   suggestions.forEach(symbol => {
//     const listItem = document.createElement('option');
//     listItem.textContent = symbol;
//     suggestionsList.appendChild(listItem);
//   });
// }


// second one ..................

// const stockInput = document.getElementById('stockInput');
// const suggestionsList = document.getElementById('suggestions');
// const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols

// stockInput.addEventListener('input', updateSuggestions);

// // Handle clicking on a suggestion
// suggestionsList.addEventListener('click', function(event) {
//   if (event.target.tagName === 'LI') {
//     stockInput.value = event.target.textContent;
//     suggestionsList.innerHTML = ''; // Clear suggestions
//   }
// });

// function updateSuggestions() {
//   const input = stockInput.value.trim().toUpperCase();

//   if (input === '') {
//     suggestionsList.innerHTML = '';
//     return;
//   }

//   const filteredSuggestions = allSymbols.filter(symbol => symbol.startsWith(input));
//   displaySuggestions(filteredSuggestions);
// }

// function displaySuggestions(suggestions) {
//   suggestionsList.innerHTML = '';

//   suggestions.forEach(symbol => {
//     const listItem = document.createElement('li');
//     listItem.textContent = symbol;
//     suggestionsList.appendChild(listItem);
//   });
// }

let allSymbols = []; // Initialize an empty array to store symbols

    // Fetch symbols from the server and store in allSymbols
    fetch('https://your-backend-api-url.com/symbols')
      .then(response => response.json())
      .then(data => {
        allSymbols = data.symbols; // Assuming the server returns an array of symbols
      })
      .catch(error => {
        console.error('Error fetching symbols:', error);
      });
const stockInput = document.getElementById('stockInput');
const suggestionsList = document.getElementById('suggestions');

//const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols

stockInput.addEventListener('input', updateSuggestions);

// Handle clicking on a suggestion
suggestionsList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    stockInput.value = event.target.textContent;
    suggestionsList.innerHTML = ''; // Clear suggestions
  }
});

function updateSuggestions() {
  const input = stockInput.value.trim().toUpperCase();

  if (input === '') {
    suggestionsList.innerHTML = '';
    return;
  }

  const filteredSuggestions = allSymbols.filter(symbol => symbol.startsWith(input));
  displaySuggestions(filteredSuggestions);
}

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = '';

  suggestions.forEach(symbol => {
    const listItem = document.createElement('li');
    listItem.textContent = symbol;
    listItem.className = 'list-group-item list-group-item-action'; // Apply Bootstrap classes
    suggestionsList.appendChild(listItem);
  });
}
