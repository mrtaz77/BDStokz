//Top 5 gainer and stock info

document.addEventListener('DOMContentLoaded', function() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const name = urlSearchParams.get('name');
  const email = urlSearchParams.get('email');
  const userType = urlSearchParams.get('userType');

  // Now you can use these variables on your dashboard page
  //console.log('Name:', name);
  console.log('Email:', email);
  console.log('User Type:', userType);

  // ... rest of your dashboard script
//});

async function fetchDataAndPopulateTable() {

const tableBody = document.getElementById("data-table-body");

const txt1 = document.getElementById("topGainer");
const txt2 = document.getElementById("topGainerLTP");
const txt3 = document.getElementById("topGainerChange");
const txt4 = document.getElementById("topGainerChangePercent");

const txt21 = document.getElementById("topLoser");
const txt22 = document.getElementById("topLoserLTP");
const txt23 = document.getElementById("topLoserChange");
const txt24 = document.getElementById("topLoserChangePercent");

try {
    const response = await fetch('http://localhost:3000/api/data'); // Change the URL to your backend API endpoint
    const data = await response.json();

    //const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    if (data) {
        txt1.textContent = data[0].SYMBOL;
        txt2.textContent = data[0].LTP;
        txt3.textContent = data[0].LTP;
        txt4.textContent = data[0].LTP;

        txt21.textContent = data[1].SYMBOL;
        txt22.textContent = data[1].LTP;
        txt23.textContent = data[1].LTP;
        txt24.textContent = data[1].LTP;
        data.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stock.SYMBOL}</td>
                <td>${stock.LTP}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = '<td colspan="2">No data available</td>';
        tableBody.appendChild(noDataRow);
    }
}
catch (error) {
    console.error('Error fetching data:', error);
}
}



async function fetchStockSug() {
  const allSymbols = [];
  try {
      const response = await fetch('http://localhost:3000/stock'); // Change the URL to your backend API endpoint
      const data = await response.json();
      data.forEach(item => {
        allSymbols.push(item.SYMBOL);
      });
      //return data;
  }
  catch (error) {
      console.error('Error fetching data:', error);
  }
  const stockInput = document.getElementById('stockInput');
    const suggestionsList = document.getElementById('suggestions');

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
}




async function activityCarousal(){

    try {
        const response = await fetch('http://localhost:3000/activity'); // Change the URL to your backend API endpoint
        const data = await response.json();
    
        //const tableBody = document.getElementById('data-table-body');
        //tableBody.innerHTML = ''; // Clear existing rows
    
const carousalInner = document.getElementById('activityCar'); // Carousel inner container
if (data) {
    data.forEach(item => {
      const carousalItem = document.createElement('div');
      carousalItem.classList.add('carousel-item');

      //const truncatedOrganizer = item.ORGANIZER.length > 20 ? item.ORGANIZER.substring(0, 20) : item.ORGANIZER;
      const organizerWords = item.ORGANIZER.split(' ');

      const truncatedOrganizer = organizerWords.slice(0, 2).join(' ');

      const carousalItemContent = document.createElement('div');
      carousalItemContent.classList.add('text-center');
      carousalItemContent.innerHTML=`<img src="../images/ipo/activity.jpg" class="thumb-lg" alt="...">
      <h3 class="my-1 font-20 fw-bold">${truncatedOrganizer}</h3>
      <p class="mb-0 fw-semibold">${item.EVENT_DATE}</p>
      <p class="mb-2">${item.DESCRIPTION}<!--<span class="text-muted">--></span></p>
      <a href="#" class="btn btn-sm btn-de-primary">Participate</a>`
      carousalItem.appendChild(carousalItemContent);
      carousalInner.appendChild(carousalItem);
    });

    // Set the first item as active
    carousalInner.firstChild.classList.add('active');
}
else {
    const noDataRow = document.createElement('tr');
    noDataRow.innerHTML = '<td colspan="2">No data available</td>';
    carousalInner.appendChild(noDataRow);
}
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}


//fetchDataAndPopulateTable();
fetchStockSug();
activityCarousal();
});
  // activity carousal ends...........................................................