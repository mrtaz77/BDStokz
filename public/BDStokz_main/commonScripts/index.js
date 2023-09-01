async function fetchDataAndPopulateTable() {
    
    const txt1 = document.getElementById("topGainltp");
    const txt2 = document.getElementById("topGainqty");
    const txt3 = document.getElementById("topGainlotsz");
    const txt4 = document.getElementById("topGainsector");
    const txt5 = document.getElementById("topGainbase");
    const txt6 = document.getElementById("topGainer");
    const txt7 = document.getElementById("topGainerChange");
    const txt8 = document.getElementById("topGainerChangePercent");
    
    const txt21 = document.getElementById("topLoseltp");
    const txt22 = document.getElementById("topLoseqty");
    const txt23 = document.getElementById("topLoselotsz");
    const txt24 = document.getElementById("topLosesector");
    const txt25 = document.getElementById("topLosebase");
    const txt26 = document.getElementById("topLoser");
    const txt27 = document.getElementById("topLoserChange");
    const txt28 = document.getElementById("topLoserChangePercent");
    
    try {
        const response = await fetch('http://localhost:3000/stock/order/gain'); // Change the URL to your backend API endpoint
        const data = await response.json();
    
        if (data) {
            txt6.textContent = data[0].SYMBOL;
            txt2.textContent = data[0].VOLUME;
            txt7.textContent = data[0].CHANGE;
            txt8.textContent = '('+data[0]['CHANGE%']+'%)';
            const response2 = await fetch('http://localhost:3000/stock/'+data[0].SYMBOL); // Change the URL to your backend API endpoint
            const data2 = await response2.json();
            txt1.textContent = data2.LTP;
            txt3.textContent = data2.LOT;
            txt4.textContent = data2.SECTOR;
            txt5.textContent = data2.PRICE;
        } else {
            console.log("error in reading watchlist data");
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
    try {
      const response2 = await fetch('http://localhost:3000/stock/order/lose'); // Change the URL to your backend API endpoint
      const data2 = await response2.json();
    
      if (data2) {
        txt26.textContent = data2[0].SYMBOL;
        txt22.textContent = data2[0].VOLUME;
        txt27.textContent = data2[0].CHANGE;
        txt28.textContent = '('+data2[0]['CHANGE%']+'%)';
        const response22 = await fetch('http://localhost:3000/stock/'+data2[0].SYMBOL); // Change the URL to your backend API endpoint
        const data22 = await response22.json();
        txt21.textContent = data22.LTP;
        txt23.textContent = data22.LOT;
        txt24.textContent = data22.SECTOR;
        txt25.textContent = data22.PRICE;
      } else {
        console.log("error in reading watchlist data");
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
        async function giveDetail(symbol){
          const url='http://localhost:3000/stock/'+symbol;
          const response = await fetch(url);
          console.log(response); // Change the URL to your backend API endpoint
           const data = await response.json();
           const stockSymbolElement = document.getElementById('stockSymbol');
           stockSymbolElement.textContent = symbol;
           const ltp = document.getElementById('ltpModal');
           const qty = document.getElementById('avlotModal');
           const lotsize = document.getElementById('lotModal');
           const sec = document.getElementById('sectorModal');
           const baseprice = document.getElementById('basePriceModal');
           //data.forEach()
           ltp.textContent = data.LTP;
           qty.textContent = data.AVAILABLE_LOTS;
           lotsize.textContent = data.LOT;
           sec.textContent = data.SECTOR;
           baseprice.textContent = data.VALUE;
        }
        function openStockDetailModal(symbol) {
          giveDetail(symbol);
          const stockDetailModal = new bootstrap.Modal(document.getElementById('stockDetail'));
          stockDetailModal.show();
        }
    }
    
    // document.getElementById("logoutbutton").addEventListener("click", async (event) => {
    //   //event.preventDefault();
    
    //   try {
    //       const response = await fetch("http://localhost:3000/logout", {
    //           method: "POST"
    //       });
    
    //       if (response.ok) {
    //           // Assuming the response status is 200 and you want to redirect to a login page
    //           window.location.href = "http://localhost:3000/BDStokz_main/login/login.html";
    //       } else {
    //           console.error("Request failed:", response.status, response.statusText);
    //       }
    //   } catch (error) {
    //       console.error("Request error:", error);
    //   }
    // });
    
    fetchDataAndPopulateTable();
    fetchStockSug();
    //});
      // activity carousal ends...........................................................