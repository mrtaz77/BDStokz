function getElementAndReplaceWithCloneAbrar(id) {
  // Get a reference to the element by its ID
  var originalElement = document.getElementById(id);

  if (originalElement) {
    
    var clonedElement = originalElement.cloneNode(true);

    // Replace the original element with the cloned one
    originalElement.parentNode.replaceChild(clonedElement, originalElement);

    // Return a reference to the cloned element
    return document.getElementById(id);
  } else {
    // If the element with the given ID does not exist, return null
    return null;
  }
}



async function fetchDataAndPopulateTable() {
  const buyButtonAcc = getElementAndReplaceWithCloneAbrar("topGainBuyButton");
  const sellButtonAcc = getElementAndReplaceWithCloneAbrar("topGainSellButton");
  
  const buyButtonAcc2 = getElementAndReplaceWithCloneAbrar("topLoseBuyButton");
  const sellButtonAcc2 = getElementAndReplaceWithCloneAbrar("topLoseSellButton");

    const txt1 = getElementAndReplaceWithCloneAbrar("topGainltp");
    const txt2 = getElementAndReplaceWithCloneAbrar("topGainqty");
    const txt3 = getElementAndReplaceWithCloneAbrar("topGainlotsz");
    const txt4 = getElementAndReplaceWithCloneAbrar("topGainsector");
    const txt5 = getElementAndReplaceWithCloneAbrar("topGainbase");
    const txt6 = getElementAndReplaceWithCloneAbrar("topGainer");
    const txt7 = getElementAndReplaceWithCloneAbrar("topGainerChange");
    const txt8 = getElementAndReplaceWithCloneAbrar("topGainerChangePercent");
    
    const txt21 = getElementAndReplaceWithCloneAbrar("topLoseltp");
    const txt22 = getElementAndReplaceWithCloneAbrar("topLoseqty");
    const txt23 = getElementAndReplaceWithCloneAbrar("topLoselotsz");
    const txt24 = getElementAndReplaceWithCloneAbrar("topLosesector");
    const txt25 = getElementAndReplaceWithCloneAbrar("topLosebase");
    const txt26 = getElementAndReplaceWithCloneAbrar("topLoser");
    const txt27 = getElementAndReplaceWithCloneAbrar("topLoserChange");
    const txt28 = getElementAndReplaceWithCloneAbrar("topLoserChangePercent");

    const userDataString = sessionStorage.getItem('userData');
    let userDataset;
    if (userDataString) {
        userDataset = JSON.parse(userDataString);
    }

    showLogTable(userDataset.userId,'logTableHolder');
  
  if(userDataset.userType !== 'Admin'){
    try {
      getElementAndReplaceWithCloneAbrar("blockStockButtonStockDetailHolder").style.display = "none";
    getElementAndReplaceWithCloneAbrar("topGainBlockStockButtonHolder").style.display = "none";
    getElementAndReplaceWithCloneAbrar("topLoseBlockStockButtonHolder").style.display = "none";
    } catch (error) {
      
    }
  }
  if(userDataset.userType === 'Customer'){
    getElementAndReplaceWithCloneAbrar("toggleUserText").textContent = 'Brokers';
  }
  else if(userDataset.userType === 'Broker'){
    getElementAndReplaceWithCloneAbrar("toggleUserText").textContent = 'My Customers';
    getElementAndReplaceWithCloneAbrar("userOrderHyperlink").style.display = "none";
    getElementAndReplaceWithCloneAbrar("investmentsHyperlink").style.display = "none";
  //   getElementAndReplaceWithCloneAbrar("buyButtonStockDetail").style.display = "none";
  // getElementAndReplaceWithCloneAbrar("sellButtonStockDetail").style.display = "none";
  // getElementAndReplaceWithCloneAbrar("topGainBuyButton").style.display = "none";
  // getElementAndReplaceWithCloneAbrar("topGainSellButton").style.display = "none";
  // getElementAndReplaceWithCloneAbrar("topLoseBuyButton").style.display = "none";
  // getElementAndReplaceWithCloneAbrar("topLoseSellButton").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topGainBuyButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topGainSellButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topGainBlockStockButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topLoseBuyButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topLoseSellButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topLoseBlockStockButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("buyButtonStockDetailHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("sellButtonStockDetailHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("blockStockButtonStockDetailHolder").style.display = "none";
  }
  else if(userDataset.userType === 'Corp'){
    getElementAndReplaceWithCloneAbrar("investmentsHyperlink").style.display = "none";
    getElementAndReplaceWithCloneAbrar("userIconAndText").style.display = "none";
    getElementAndReplaceWithCloneAbrar("topGainBuyButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topGainSellButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topGainBlockStockButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topLoseBuyButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topLoseSellButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("topLoseBlockStockButtonHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("buyButtonStockDetailHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("sellButtonStockDetailHolder").style.display = "none";
  getElementAndReplaceWithCloneAbrar("blockStockButtonStockDetailHolder").style.display = "none";
  }



  getElementAndReplaceWithCloneAbrar("mainProfileUser").href = "../position/position.html?name="+userDataset.username;
    try {
        const response = await fetch('http://localhost:3000/stock/order/gain'); // Change the URL to your backend API endpoint
        const data = await response.json();
    
        if (data) {
            txt6.textContent = data[0].SYMBOL;
            getElementAndReplaceWithCloneAbrar('ordersFromStockDetailsTopGain').href = "../orders/orders.html?symbol="+data[0].SYMBOL+"&action=none&del=none";
            txt2.textContent = data[0].VOLUME;
            txt7.textContent = data[0].CHANGE;
            txt8.textContent = '('+data[0]['CHANGE%']+'%)';
            const response2 = await fetch('http://localhost:3000/stock/'+data[0].SYMBOL); // Change the URL to your backend API endpoint
            const data2 = await response2.json();
            txt1.textContent = data2.LTP;
            txt3.textContent = data2.LOT;
            txt4.textContent = data2.SECTOR;
            txt5.textContent = data2.PRICE;
            function accBuySell (){
              const buyhead = getElementAndReplaceWithCloneAbrar('BuyStocksLabel');
              const buyLtp  = getElementAndReplaceWithCloneAbrar('buyStocksLtp');
              const buyChange = getElementAndReplaceWithCloneAbrar('buyStocksChange');
              const buyChangePercent = getElementAndReplaceWithCloneAbrar('buyStocksChangePercent');
              const buyIcon = getElementAndReplaceWithCloneAbrar('buyStocksIcon');
  
  
              const buyButtonOrg = getElementAndReplaceWithCloneAbrar('buyButtonOriginal');
              buyButtonOrg.addEventListener("click", async function(){
               placeOrder(data2.SYMBOL,'BUY');
              });
  
  
              const sellhead = getElementAndReplaceWithCloneAbrar('SellStocksLabel');
              const sellLtp  = getElementAndReplaceWithCloneAbrar('sellStocksLtp');
              const sellChange = getElementAndReplaceWithCloneAbrar('sellStocksChange');
              const sellChangePercent = getElementAndReplaceWithCloneAbrar('sellStocksChangePercent');
              const sellIcon = getElementAndReplaceWithCloneAbrar('sellStocksIcon');
  
  
              const sellButtonOrg = getElementAndReplaceWithCloneAbrar('sellButtonOriginal');
              sellButtonOrg.addEventListener("click", async function(){
                placeOrder(data2.SYMBOL,'SELL');
              });
  
              
              if(parseInt(data2.CHANGE) > 0){
                buyIcon.classList.add("ti");
                buyIcon.classList.add("ti-trending-up");
                buyIcon.classList.add("text-success");
                buyChange.classList.add("text-success");
                buyChangePercent.classList.add("text-success");
                sellIcon.classList.add("ti");
                sellIcon.classList.add("ti-trending-up");
                sellIcon.classList.add("text-success");
                sellChange.classList.add("text-success");
                sellChangePercent.classList.add("text-success");
              }
  
              else{
                buyIcon.classList.add("ti");
                buyIcon.classList.add("ti-trending-down");
                buyIcon.classList.add("text-danger");
                buyChange.classList.add("text-danger");
                buyChangePercent.classList.add("text-danger");
                sellIcon.classList.add("ti");
                sellIcon.classList.add("ti-trending-down");
                sellIcon.classList.add("text-danger");
                sellChange.classList.add("text-danger");
                sellChangePercent.classList.add("text-danger");
              }
  
              buyhead.textContent = data2.CORP_NAME;
              buyLtp.textContent = data2.LTP;
              buyChange.textContent = data2.CHANGE;
              buyChangePercent.textContent =  '('+data2['CHANGE%']+'%)';
  
              sellhead.textContent = data2.CORP_NAME;
              sellLtp.textContent = data2.LTP;
              sellChange.textContent = data2.CHANGE;
              sellChangePercent.textContent =  '('+data2['CHANGE%']+'%)';
          };

          buyButtonAcc.addEventListener("click", accBuySell);
          sellButtonAcc.addEventListener("click", accBuySell);
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
        getElementAndReplaceWithCloneAbrar('ordersFromStockDetailsTopLose').href = "../orders/orders.html?symbol="+data2[0].SYMBOL+"&action=none&del=none";
        txt22.textContent = data2[0].VOLUME;
        txt27.textContent = data2[0].CHANGE;
        txt28.textContent = '('+data2[0]['CHANGE%']+'%)';
        const response22 = await fetch('http://localhost:3000/stock/'+data2[0].SYMBOL); // Change the URL to your backend API endpoint
        const data22 = await response22.json();
        txt21.textContent = data22.LTP;
        txt23.textContent = data22.LOT;
        txt24.textContent = data22.SECTOR;
        txt25.textContent = data22.PRICE;
        function accBuySell2 (){
          const buyhead = getElementAndReplaceWithCloneAbrar('BuyStocksLabel');
          const buyLtp  = getElementAndReplaceWithCloneAbrar('buyStocksLtp');
          const buyChange = getElementAndReplaceWithCloneAbrar('buyStocksChange');
          const buyChangePercent = getElementAndReplaceWithCloneAbrar('buyStocksChangePercent');
          const buyIcon = getElementAndReplaceWithCloneAbrar('buyStocksIcon');
    
          const buyButtonOrg = getElementAndReplaceWithCloneAbrar('buyButtonOriginal');
          buyButtonOrg.addEventListener("click", async function(){
            placeOrder(data22.SYMBOL,'BUY');
          });
    
          const sellhead = getElementAndReplaceWithCloneAbrar('SellStocksLabel');
          const sellLtp  = getElementAndReplaceWithCloneAbrar('sellStocksLtp');
          const sellChange = getElementAndReplaceWithCloneAbrar('sellStocksChange');
          const sellChangePercent = getElementAndReplaceWithCloneAbrar('sellStocksChangePercent');
          const sellIcon = getElementAndReplaceWithCloneAbrar('sellStocksIcon');
    
    
          const sellButtonOrg = getElementAndReplaceWithCloneAbrar('sellButtonOriginal');
          sellButtonOrg.addEventListener("click", async function(){
            placeOrder(data22.SYMBOL,'SELL');
          });
    
          
    
          if(parseInt(data22.CHANGE) > 0){
            buyIcon.classList.add("ti");
            buyIcon.classList.add("ti-trending-up");
            buyIcon.classList.add("text-success");
            buyChange.classList.add("text-success");
            buyChangePercent.classList.add("text-success");
            sellIcon.classList.add("ti");
            sellIcon.classList.add("ti-trending-up");
            sellIcon.classList.add("text-success");
            sellChange.classList.add("text-success");
            sellChangePercent.classList.add("text-success");
          }
    
          else{
            buyIcon.classList.add("ti");
            buyIcon.classList.add("ti-trending-down");
            buyIcon.classList.add("text-danger");
            buyChange.classList.add("text-danger");
            buyChangePercent.classList.add("text-danger");
            sellIcon.classList.add("ti");
            sellIcon.classList.add("ti-trending-down");
            sellIcon.classList.add("text-danger");
            sellChange.classList.add("text-danger");
            sellChangePercent.classList.add("text-danger");
          }
    
          buyhead.textContent = data22.CORP_NAME;
          buyLtp.textContent = data22.LTP;
          buyChange.textContent = data22.CHANGE;
          buyChangePercent.textContent =  '('+data22['CHANGE%']+'%)';
    
          sellhead.textContent = data22.CORP_NAME;
          sellLtp.textContent = data22.LTP;
          sellChange.textContent = data22.CHANGE;
          sellChangePercent.textContent =  '('+data22['CHANGE%']+'%)';
      };
      buyButtonAcc2.addEventListener("click", accBuySell2);
      sellButtonAcc2.addEventListener("click", accBuySell2);
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
      const stockInput = getElementAndReplaceWithCloneAbrar('stockInput');
        const suggestionsList = getElementAndReplaceWithCloneAbrar('suggestions');
    
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
           const stockSymbolElement = getElementAndReplaceWithCloneAbrar('stockSymbol');
           stockSymbolElement.textContent = symbol;
           const ltp = getElementAndReplaceWithCloneAbrar('ltpModal');
           const qty = getElementAndReplaceWithCloneAbrar('avlotModal');
           const lotsize = getElementAndReplaceWithCloneAbrar('lotModal');
           const sec = getElementAndReplaceWithCloneAbrar('sectorModal');
           const baseprice = getElementAndReplaceWithCloneAbrar('basePriceModal');

           const buyhead = getElementAndReplaceWithCloneAbrar('BuyStocksLabel');
           const buyLtp  = getElementAndReplaceWithCloneAbrar('buyStocksLtp');
           const buyChange = getElementAndReplaceWithCloneAbrar('buyStocksChange');
           const buyChangePercent = getElementAndReplaceWithCloneAbrar('buyStocksChangePercent');
           const buyIcon = getElementAndReplaceWithCloneAbrar('buyStocksIcon');

           const buyButtonOrg = getElementAndReplaceWithCloneAbrar('buyButtonOriginal');
       buyButtonOrg.addEventListener("click", async function(){
        placeOrder(data.SYMBOL,'BUY');
       });

       const sellhead = getElementAndReplaceWithCloneAbrar('SellStocksLabel');
       const sellLtp  = getElementAndReplaceWithCloneAbrar('sellStocksLtp');
       const sellChange = getElementAndReplaceWithCloneAbrar('sellStocksChange');
       const sellChangePercent = getElementAndReplaceWithCloneAbrar('sellStocksChangePercent');
       const sellIcon = getElementAndReplaceWithCloneAbrar('sellStocksIcon');

       const sellButtonOrg = getElementAndReplaceWithCloneAbrar('sellButtonOriginal');
       sellButtonOrg.addEventListener("click", async function(){
        placeOrder(data.SYMBOL,'SELL');
       });


       if(parseInt(data.CHANGE) > 0){
        buyIcon.classList.add("ti");
        buyIcon.classList.add("ti-trending-up");
        buyIcon.classList.add("text-success");
        buyChange.classList.add("text-success");
        buyChangePercent.classList.add("text-success");
        sellIcon.classList.add("ti");
        sellIcon.classList.add("ti-trending-up");
        sellIcon.classList.add("text-success");
        sellChange.classList.add("text-success");
        sellChangePercent.classList.add("text-success");
       }

       else{
        buyIcon.classList.add("ti");
        buyIcon.classList.add("ti-trending-down");
        buyIcon.classList.add("text-danger");
        buyChange.classList.add("text-danger");
        buyChangePercent.classList.add("text-danger");
        sellIcon.classList.add("ti");
        sellIcon.classList.add("ti-trending-down");
        sellIcon.classList.add("text-danger");
        sellChange.classList.add("text-danger");
        sellChangePercent.classList.add("text-danger");
       }


           //data.forEach()
           ltp.textContent = data.LTP;
           qty.textContent = data.AVAILABLE_LOTS;
           lotsize.textContent = data.LOT;
           sec.textContent = data.SECTOR;
           baseprice.textContent = data.VALUE;


           buyhead.textContent = data.CORP_NAME;
          buyLtp.textContent = data.LTP;
          buyChange.textContent = data.CHANGE;
          buyChangePercent.textContent =  '('+data['CHANGE%']+'%)';

          sellhead.textContent = data.CORP_NAME;
          sellLtp.textContent = data.LTP;
          sellChange.textContent = data.CHANGE;
          sellChangePercent.textContent =  '('+data['CHANGE%']+'%)';


        }
        function openStockDetailModal(symbol) {
          giveDetail(symbol);
          const stockDetailModal = new bootstrap.Modal(getElementAndReplaceWithCloneAbrar('stockDetail'));
          getElementAndReplaceWithCloneAbrar('ordersFromStockDetails').href = "../orders/orders.html?symbol="+symbol+"&action=none&del=none";
          stockDetailModal.show();
          // giveDetail(symbol);
          // getElementAndReplaceWithCloneAbrar('ordersFromStockDetails').href = "../orders/orders.html?symbol="+symbol+"&action=none&del=none";
          // //stockDetailModal.show();
          // $('#stockDetail').modal('toggle');
        }
    }
    getElementAndReplaceWithCloneAbrar("logoutbutton").addEventListener("click", async (event) => {
      //event.preventDefault();
    
      try {
          const response = await fetch("http://localhost:3000/logout", {
              method: "POST"
          });
    
          if (response.ok) {
              // Assuming the response status is 200 and you want to redirect to a login page
              window.location.href = "http://localhost:3000/BDStokz_main/login/login.html";
          } else {
              console.error("Request failed:", response.status, response.statusText);
          }
      } catch (error) {
          console.error("Request error:", error);
      }
    });
    
    fetchDataAndPopulateTable();
    fetchStockSug();

    async function placeOrder(symbol,type) {
      const userDataString = sessionStorage.getItem('userData');
      let userDataset;
      if (userDataString) {
          userDataset = JSON.parse(userDataString);
      }
        const price = getElementAndReplaceWithCloneAbrar(type+'Price').value;
        const quantity = getElementAndReplaceWithCloneAbrar(type+'Quantity').value;
    
        const userData = {
          symbol: symbol,
          userId: userDataset.userId,
          type: type,
          price: price,
          quantity: quantity,
          stopPrice : null
        };
    
        try {
          const response = await fetch('http://localhost:3000/order/placeOrder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });
          const data = await response.json();
          if (response.ok) {
            showOrderPlacingErrors(1,['Order successfully placed!'],type+'ButtonOriginalErrbox')
            // const errbox = getElementAndReplaceWithCloneAbrar(type+'ButtonOriginalErrbox');
            // const newDiv = document.createElement('div');
            //     newDiv.className = 'alert alert-success';
            //     newDiv.textContent = 'Order successfully placed!';
            //     const closeButton = document.createElement('button');
            //         closeButton.className = 'close';
            //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
    
            //         closeButton.addEventListener('click', function () {
            //             newDiv.parentNode.removeChild(newDiv);
            //         });
            //         newDiv.appendChild(closeButton);
            //         errbox.appendChild(newDiv);
          } else {
            showOrderPlacingErrors(0,data.errors,type+'ButtonOriginalErrbox')
            // //if(data.message === 'errors'){
            //   const errbox = getElementAndReplaceWithCloneAbrar(type+'ButtonOriginalErrbox');
            //     let cnt=0;
            //     data.errors.forEach(item => {
            //       const newDiv = document.createElement('div');
            //       newDiv.className = 'alert alert-danger';
            //       newDiv.textContent = item;
            //       const closeButton = document.createElement('button');
            //         closeButton.className = 'close';
            //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
    
            //         closeButton.addEventListener('click', function () {
            //             newDiv.parentNode.removeChild(newDiv);
            //         });
            //         newDiv.appendChild(closeButton);
            //       newDiv.id='err'+cnt;
            //       errbox.appendChild(newDiv);
            //       cnt+=1;
            //     });
            // //}
            // //console.error('Registration failed:', response.statusText);
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
    }
  
    //});
      // activity carousal ends...........................................................

function showOrderPlacingErrors(flag,errmsgs,id){
  const errbox = getElementAndReplaceWithCloneAbrar(id);
  errbox.innerHTML = '';
  let cnt=0;
  errmsgs.forEach(item => {
    const newDiv = document.createElement('div');
    if(flag === 1)
    newDiv.className = "alert alert-success alert-dismissible fade show mb-3";
    else
    newDiv.className = "alert alert-danger alert-dismissible fade show mb-3";
    newDiv.style.width = "100%";
    newDiv.innerHTML = `
    ${item}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    newDiv.id='err'+cnt;
    errbox.appendChild(newDiv);
    cnt+=1;
  });
}

async function showLogTable(uid,content_id){
  try {
    const response = await fetch('http://localhost:3000/user/log?userId='+uid); // Change the URL to your backend API endpoint
    const data = await response.json();
  
    if(response.ok){
      const logs = data.logs;
      console.log(logs);
      const holder = getElementAndReplaceWithCloneAbrar(content_id);
      holder.innerHTML =``;
      getElementAndReplaceWithCloneAbrar("badgeOfTheLogTable").textContent = logs.size ;
      logs.forEach(element => {
        const anchorElem =document.createElement('a');
        //anchorElem.href = '#';
        anchorElem.classList.add("dropdown-item");
        anchorElem.classList.add('py-3');
        anchorElem.setAttribute('data-bs-toggle', 'modal');
        anchorElem.setAttribute('data-bs-target', '#notPremiumWarning');
        anchorElem.innerHTML = `<small class="float-end text-muted ps-2">${element.EVENT_TIME}</small>
        <div class="media">
            <div class="avatar-md bg-soft-primary">
                <i class="ti ti-chart-arcs"></i>
            </div>
            <div class="media-body align-self-center ms-2 text-truncate">
                <h6 class="my-0 fw-normal text-dark">${element.EVENT_TYPE}</h6>
                <small class="text-muted mb-0">${element.DESCRIPTION}</small>
            </div><!--end media-body-->
        </div>`
        // anchorElem.addEventListener("click", function(){
        //   getElementAndReplaceWithCloneAbrar("logTitle").textContent = element.EVENT_TYPE;
        //   getElementAndReplaceWithCloneAbrar("logDescription").innerHTML= element.DESCRIPTION;
        // })
        holder.appendChild(anchorElem);
        anchorElem.addEventListener("click",function(){
          const head = getElementAndReplaceWithCloneAbrar("exampleModalFullscreenLgLabel");
          head.textContent = element.EVENT_TYPE;
          head.classList.remove('alert-danger');
          getElementAndReplaceWithCloneAbrar("logDesBody").innerHTML= element.DESCRIPTION;
          getElementAndReplaceWithCloneAbrar("activityRegButton").style.display = "none";
          getElementAndReplaceWithCloneAbrar("regFee").style.display = "none";
          getElementAndReplaceWithCloneAbrar("regFeeText").style.display = "none";
        });
      });
    }
    else{
      showOrderPlacingErrors(1,data.errors,content_id);
    }
  } catch (error) {
    
  }
}