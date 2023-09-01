
// const stockInput = document.getElementById('stockInput');
// const suggestionsList = document.getElementById('suggestions');
// const collapsibleContainer = document.getElementById('suggestions'); // Container for collapsible content
// const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols

// stockInput.addEventListener('input', updateSuggestions);

// // Handle clicking on a suggestion
// suggestionsList.addEventListener('click', function(event) {
//   if (event.target.tagName === 'LI') {
//     stockInput.value = event.target.textContent;
//     createCollapsibleArea(event.target.textContent);
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
//     listItem.className = 'list-group-item list-group-item-action'; // Apply Bootstrap classes
//     suggestionsList.appendChild(listItem);
//   });
// }

// function createCollapsibleArea(symbol) {
//   // Create a new collapsible content div
//   const collapsibleContent = document.createElement('div');
//   collapsibleContent.classList.add('accordion-item');
//   collapsibleContent.innerHTML = `
//     <div class="accordion-header" id="heading-${symbol}">
//       <a class="accordion-button d-block py-2 px-3 collapsed" data-bs-toggle="collapse" data-bs-target="#collapse-${symbol}" aria-expanded="false" aria-controls="collapse-${symbol}">
//         ${symbol}
//       </a>
//     </div>
//     <div id="collapse-${symbol}" class="accordion-collapse collapse" aria-labelledby="heading-${symbol}" data-bs-parent="#collapsibleContainer">
//       <div class="accordion-body">
//         <!-- Your content goes here -->
//         <!-- Use the content you provided in your question -->
//       </div>
//     </div>`;

//   collapsibleContainer.appendChild(collapsibleContent);

//   // Hide previous collapsible areas
//   const allCollapsibleAreas = collapsibleContainer.querySelectorAll('.accordion-collapse');
//   allCollapsibleAreas.forEach(area => {
//     const bsCollapse = new bootstrap.Collapse(area);
//     bsCollapse.hide();
//   });

//   // Show the newly created collapsible area
//   const newCollapsibleArea = collapsibleContainer.querySelector(`#collapse-${symbol}`);
//   const bsCollapse = new bootstrap.Collapse(newCollapsibleArea);
//   bsCollapse.show();
// }

// second one..................................

// const stockInput = document.getElementById('stockInput');
// const suggestionsList = document.getElementById('suggestions');
// const collapsibleContainer = document.getElementById('collapsibleContainer'); // Container for collapsible content
// const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols
// let openSymbol = null; // Track the currently open symbol

// stockInput.addEventListener('input', updateSuggestions);

// // Handle clicking on a suggestion
// suggestionsList.addEventListener('click', function(event) {
//   if (event.target.tagName === 'LI') {
//     stockInput.value = event.target.textContent;
//     const symbol = event.target.textContent;
    
//     if (openSymbol === symbol) {
//       // Clicked on the same symbol again, close the collapsible area
//       const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${symbol}`));
//       bsCollapse.hide();
//       openSymbol = null;
//     } else {
//       // Clicked on a new symbol, close the previous collapsible area and open the new one
//       if (openSymbol) {
//         const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${openSymbol}`));
//         bsCollapse.hide();
//       }
      
//       createCollapsibleArea(symbol);
//       openSymbol = symbol;
//     }
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
//     listItem.className = 'list-group-item list-group-item-action'; // Apply Bootstrap classes
//     suggestionsList.appendChild(listItem);
//   });
// }

// function createCollapsibleArea(symbol) {
//   // Create a new collapsible content div
//   const collapsibleContent = document.createElement('div');
//   collapsibleContent.classList.add('accordion-item');
//   collapsibleContent.innerHTML = `
//     <div class="accordion-header" id="heading-${symbol}">
//       <a class="accordion-button d-block py-2 px-3 collapsed" data-bs-toggle="collapse" data-bs-target="#collapse-${symbol}" aria-expanded="false" aria-controls="collapse-${symbol}">
//         ${symbol}
//       </a>
//     </div>
//     <div id="collapse-${symbol}" class="accordion-collapse collapse" aria-labelledby="heading-${symbol}" data-bs-parent="#collapsibleContainer">
//       <div class="accordion-body">
//         <!-- Your content goes here -->
//         <!-- Use the content you provided in your question -->
//       </div>
//     </div>`;

//   collapsibleContainer.appendChild(collapsibleContent);

//   // Hide previous collapsible areas
//   const allCollapsibleAreas = collapsibleContainer.querySelectorAll('.accordion-collapse');
//   allCollapsibleAreas.forEach(area => {
//     const bsCollapse = new bootstrap.Collapse(area);
//     bsCollapse.hide();
//   });

//   // Show the newly created collapsible area
//   const newCollapsibleArea = collapsibleContainer.querySelector(`#collapse-${symbol}`);
//   const bsCollapse = new bootstrap.Collapse(newCollapsibleArea);
//   bsCollapse.show();
// }


// 3rd one

// const stockInput = document.getElementById('stockInput');
// const suggestionsList = document.getElementById('suggestions');
// const collapsibleContainer = document.getElementById('suggestions'); // Container for collapsible content
// const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols
// let openSymbol = null; // Track the currently open symbol

// stockInput.addEventListener('input', updateSuggestions);

// // Handle clicking on a suggestion
// suggestionsList.addEventListener('click', function(event) {
//   if (event.target.tagName === 'LI') {
//     const symbol = event.target.textContent;

//     if (openSymbol === symbol) {
//       // Toggle the collapsible area state
//       const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${symbol}`));
//       bsCollapse.toggle();
//     } else {
//       // Close the previous collapsible area and open the new one
//       if (openSymbol) {
//         const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${openSymbol}`));
//         bsCollapse.hide();
//       }

//       createCollapsibleArea(symbol);
//       openSymbol = symbol;
//     }
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
//     listItem.className = 'list-group-item list-group-item-action'; // Apply Bootstrap classes
//     suggestionsList.appendChild(listItem);
//   });
// }

// function createCollapsibleArea(symbol) {
//   // Create a new collapsible content div
//   const collapsibleContent = document.createElement('div');
//   collapsibleContent.classList.add('accordion-item');
//   collapsibleContent.innerHTML = `
//     <!--<div class="accordion-header" id="heading-${symbol}">
//       <a class="accordion-button d-block py-2 px-3 collapsed" data-bs-toggle="collapse" data-bs-target="#collapse-${symbol}" aria-expanded="false" aria-controls="collapse-${symbol}">
//         ${symbol}
//       </a>
//     </div>-->
//     <div id="collapse-${symbol}" class="accordion-collapse collapse" aria-labelledby="heading-${symbol}" data-bs-parent="#collapsibleContainer">
//       <div class="accordion-body">
//         <!-- Your content goes here -->
//         <p>Some dummy content for ${symbol}</p>
//       </div>
//     </div>`;

//   collapsibleContainer.appendChild(collapsibleContent);

//   // Hide the newly created collapsible area
//   const newCollapsibleArea = collapsibleContainer.querySelector(`#collapse-${symbol}`);
//   const bsCollapse = new bootstrap.Collapse(newCollapsibleArea);
//   bsCollapse.hide();
// }


// const stockInput = document.getElementById('stockInput');
// const suggestionsList = document.getElementById('suggestions');
// const collapsibleContainer = document.getElementById('suggestions'); // Container for collapsible content
// const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols
// let openSymbol = null; // Track the currently open symbol

// stockInput.addEventListener('input', updateSuggestions);

// // Handle clicking on a suggestion
// suggestionsList.addEventListener('click', function(event) {
//   if (event.target.tagName === 'LI') {
//     stockInput.value = event.target.textContent;
//     const symbol = event.target.textContent;
    
//     if (openSymbol === symbol) {
//       // Clicked on the same symbol again, close the collapsible area
//       const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${symbol}`));
//       bsCollapse.hide();
//       openSymbol = null;
//     } else {
//       // Clicked on a new symbol, close the previous collapsible area and open the new one
//       if (openSymbol) {
//         const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${openSymbol}`));
//         bsCollapse.hide();
//       }
      
//       createCollapsibleArea(symbol);
//       openSymbol = symbol;
//     }
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
//     listItem.className = 'list-group-item list-group-item-action'; // Apply Bootstrap classes
//     suggestionsList.appendChild(listItem);
//   });
// }

// function createCollapsibleArea(symbol) {
//   // Create a new collapsible content div
//   const collapsibleContent = document.createElement('div');
//   collapsibleContent.classList.add('accordion-item');
//   collapsibleContent.innerHTML = `
    
//     <div id="collapse-${symbol}" class="accordion-collapse collapse" aria-labelledby="heading-${symbol}" data-bs-parent="#collapsibleContainer">
//       <div class="accordion-body">
//         <!-- Your content goes here -->
//         <!-- Use the content you provided in your question -->
//       </div>
//     </div>`;

//   collapsibleContainer.appendChild(collapsibleContent);

//   // Hide previous collapsible areas
//   const allCollapsibleAreas = collapsibleContainer.querySelectorAll('.accordion-collapse');
//   allCollapsibleAreas.forEach(area => {
//     const bsCollapse = new bootstrap.Collapse(area);
//     bsCollapse.hide();
//   });

//   // Show the newly created collapsible area
//   const newCollapsibleArea = collapsibleContainer.querySelector(`#collapse-${symbol}`);
//   const bsCollapse = new bootstrap.Collapse(newCollapsibleArea);
//   bsCollapse.show();
// }

// const stockInput = document.getElementById('stockInput');
// const suggestionsList = document.getElementById('suggestions');
// const collapsibleContainer = document.getElementById('collapsibleContainer'); // Container for collapsible content
// const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols
// let openSymbol = null; // Track the currently open symbol

// stockInput.addEventListener('input', updateSuggestions);

// // Handle clicking on a suggestion
// suggestionsList.addEventListener('click', function(event) {
//   if (event.target.tagName === 'LI') {
//     const symbol = event.target.textContent;
    
//     if (openSymbol === symbol) {
//       // Clicked on the same symbol again, toggle the collapsible area
//       const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${symbol}`));
//       bsCollapse.toggle();
//     } else {
//       // Clicked on a new symbol, close the previous collapsible area and open the new one
//       if (openSymbol) {
//         const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${openSymbol}`));
//         bsCollapse.hide();
//       }
      
//       openCollapsibleArea(symbol);
//     }
//   }
// });

// function updateSuggestions() {
//   const input = stockInput.value.trim().toUpperCase();

//   if (input === '') {
//     suggestionsList.innerHTML = '';
//     collapsibleContainer.innerHTML = ''; // Clear the collapsible areas
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
//     listItem.className = 'list-group-item list-group-item-action'; // Apply Bootstrap classes
//     suggestionsList.appendChild(listItem);
//   });
// }

// function openCollapsibleArea(symbol) {
//   const bsCollapse = new bootstrap.Collapse(document.getElementById(`collapse-${symbol}`));
//   bsCollapse.show();
//   openSymbol = symbol;
// }

// final and easiest one
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
//     listItem.className = 'list-group-item list-group-item-action'; // Apply Bootstrap classes
//     suggestionsList.appendChild(listItem);
//   });
// }

const stockInput = document.getElementById('stockInput');
const suggestionsList = document.getElementById('suggestions');

const allSymbols = ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA', 'FB', 'NFLX', 'NVDA']; // Example list of symbols

stockInput.addEventListener('input', updateSuggestions);

// Handle clicking on a suggestion
suggestionsList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    stockInput.value = event.target.textContent;
    suggestionsList.innerHTML = ''; // Clear suggestions
    openStockDetailModal(event.target.textContent);
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

function openStockDetailModal(symbol) {
  const stockSymbolElement = document.getElementById('stockSymbol');
  stockSymbolElement.textContent = symbol;

  const stockDetailModal = new bootstrap.Modal(document.getElementById('stockDetail'));
  stockDetailModal.show();
}

const carousalInner = document.getElementById('activityCar'); // Carousel inner container

fetch("http://localhost:3000/api/data")
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const carousalItem = document.createElement('div');
      carousalItem.classList.add('carousel-item');

      const carousalItemContent = document.createElement('div');
      carousalItemContent.classList.add('d-flex', 'justify-content-between', 'align-items-center');

      const companyDiv = document.createElement('div');
      companyDiv.textContent = item.company;

      const stockPriceDiv = document.createElement('div');
      stockPriceDiv.textContent = item.stockPrice.toFixed(2);
      stockPriceDiv.classList.add('text-end');

      carousalItemContent.appendChild(companyDiv);
      carousalItemContent.appendChild(stockPriceDiv);
      carousalItem.appendChild(carousalItemContent);
      carousalInner.appendChild(carousalItem);
    });

    // Set the first item as active
    carousalInner.firstChild.classList.add('active');
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
