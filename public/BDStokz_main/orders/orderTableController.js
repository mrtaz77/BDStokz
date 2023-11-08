
// Function to get query parameters as an object
function getQueryParameters() {
    var queryParams = {};
    var queryString = window.location.search.substring(1); // Remove the leading '?'
    var paramsArray = queryString.split('&');
  
    for (var i = 0; i < paramsArray.length; i++) {
      var param = paramsArray[i].split('=');
      var paramName = decodeURIComponent(param[0]);
      var paramValue = decodeURIComponent(param[1]);
      queryParams[paramName] = paramValue;
    }
    console.log(`Query params : ${queryParams}`);
    return queryParams;
  }
  

  var queryParams = getQueryParameters();
  
  var action = queryParams.action;
  //var ed = queryParams.ed;
  var del = queryParams.del;
  var symbol =  queryParams.symbol;
  
  //var setSellSuccess = queryParams.setSellSuccess;
  //var setBuyStatus = queryParams.setBuyStatus;
  
  
async function fillData(strt){
    try {
        let userData;
        const userDataString = sessionStorage.getItem('userData');
            if (userDataString) {
                userData = JSON.parse(userDataString);
            }
        if(userData.userType === 'Broker'){ action = 'none'; del = 'none';}
        if(userData.userType === 'Corp'){
            const responsefck = await fetch('http://localhost:3000/user/profile/'+userData.username); 
            const datafck = await responsefck.json();
            let SSymbol = datafck[0].SYMBOL;
            if(queryParams.userId){
            let lnk = 'http://localhost:3000/order/symbol?symbol='+SSymbol+'&type=BUY';
            const response = await fetch(lnk); // Change the URL to your backend API endpoint
            const data = await response.json();

            const tableBody = document.getElementById('buyOrders');
            tableBody.innerHTML = ''; // Clear existing rows
            document.getElementById("actionColumnHeader").style.display = '';
            document.getElementById("actionColumnHeader").style.display = 'block';

            if (data) {
                    for(let i=10*strt;i<Math.min(10*(strt+1),data.length);i++){
                    const row = document.createElement('tr');
                    let stl;
                    if(data[i].STATUS === 'SUCCESS')
                    stl='success';
                    if(data[i].STATUS === 'PENDING')
                    stl='warning';
                    if(data[i].STATUS === 'FAILURE')
                    stl='danger';
                    row.innerHTML = `
                        <td>${data[i].ORDER_ID}</td>
                        <td><span class="text-${stl}">${data[i].STATUS}</span></td>
                        <td>${data[i].TRANSACTION_TIME}</td>
                        <td  contenteditable="true" id="BUYorderQntty${i}">${data[i].LATEST_QUANTITY }</td>
                        <td>${SSymbol}</td>
                        <td  contenteditable="true" id="BUYorderPrice${i}">${data[i].LATEST_PRICE}</td>
                        <td  style="display: ${action};">
                        <a class="btn btn-sm btn-success" style="display: block;"><i class="ti ti-pencil text-white email-action-icons-item" onclick="setBuyOrderStatus(${data[i].ORDER_ID},'SUCCESS')"></i></a>
                        <a class="btn btn-sm btn-danger" style="display: block;"><i class="ti ti-x text-white email-action-icons-item" onclick="setBuyOrderStatus(${data[i].ORDER_ID},'FAILURE')"></i></a>
                    </td>
                    `;
                    tableBody.appendChild(row);
                    }
                    
            } else {
                const noDataRow = document.createElement('tr');
                noDataRow.innerHTML = '<td colspan="2">No data available</td>';
                tableBody.appendChild(noDataRow);
            }
            }
            else{
            let lnk = 'http://localhost:3000/order/symbol?symbol='+symbol+'&type=BUY';
            const response = await fetch(lnk); // Change the URL to your backend API endpoint
            const data = await response.json();

            const tableBody = document.getElementById('buyOrders');
            tableBody.innerHTML = ''; // Clear existing rows
            document.getElementById("actionColumnHeader").style.display = '';
            document.getElementById("actionColumnHeader").style.display = action;

            if (data) {
                //data.forEach(stock => {
                    for(let i=10*strt;i<Math.min(10*(strt+1),data.length);i++){
                    const row = document.createElement('tr');
                    let stl;
                    if(data[i].STATUS === 'SUCCESS')
                    stl='success';
                    if(data[i].STATUS === 'PENDING')
                    stl='warning';
                    if(data[i].STATUS === 'FAILURE')
                    stl='danger';
                    row.innerHTML = `
                        <td>${data[i].ORDER_ID}</td>
                        <td><span class="text-${stl}">${data[i].STATUS}</span></td>
                        <td>${data[i].TRANSACTION_TIME}</td>
                        <td  contenteditable="true" id="BUYorderQntty${i}">${data[i].LATEST_QUANTITY }</td>
                        <td>${symbol}</td>
                        <td  contenteditable="true" id="BUYorderPrice${i}">${data[i].LATEST_PRICE}</td>
                        <td  style="display: ${action};">
                        <a class="btn btn-sm btn-success" style="display: ${action};"><i class="ti ti-pencil text-white email-action-icons-item" onclick="updateOrder(${i},'BUY',${data[i].ORDER_ID})"></i></a>
                        <a class="btn btn-sm btn-danger" style="display: ${del};"><i class="ti ti-x text-white email-action-icons-item" onclick="delOrder(${i},'BUY',${data[i].ORDER_ID})"></i></a>
                    </td>
                    `;
                    tableBody.appendChild(row);
                //});
                    }
                    
            } else {
                const noDataRow = document.createElement('tr');
                noDataRow.innerHTML = '<td colspan="2">No data available</td>';
                tableBody.appendChild(noDataRow);
              }
            }
        }
        else{
            let lnk,symFlag;
            symFlag=0;
            if(queryParams.userId)
            lnk = 'http://localhost:3000/order/userOrders?userId='+queryParams.userId+'&type=BUY';
            else{
              lnk = 'http://localhost:3000/order/symbol?symbol='+symbol+'&type=BUY';
              symFlag=1;
            }
            const response = await fetch(lnk); // Change the URL to your backend API endpoint
            const data = await response.json();

            const tableBody = document.getElementById('buyOrders');
            tableBody.innerHTML = ''; // Clear existing rows

            document.getElementById("actionColumnHeader").style.display = '';
            document.getElementById("actionColumnHeader").style.display = action;


            let finalSymbol;
            if (data) {
                    for(let i=10*strt;i<Math.min(10*(strt+1),data.length);i++){
                      if(symFlag === 0){
                        finalSymbol = data[i].SYMBOL;
                       }
                       else{
                        finalSymbol = symbol;
                       }
                    const row = document.createElement('tr');
                    let stl;
                    if(data[i].STATUS === 'SUCCESS')
                    stl='success';
                    if(data[i].STATUS === 'PENDING')
                    stl='warning';
                    if(data[i].STATUS === 'FAILURE')
                    stl='danger';
                    row.innerHTML = `
                        <td>${data[i].ORDER_ID}</td>
                        <td><span class="text-${stl}">${data[i].STATUS}</span></td>
                        <td>${data[i].TRANSACTION_TIME}</td>
                        <td  contenteditable="true" id="BUYorderQntty${i}">${data[i].LATEST_QUANTITY }</td>
                        <td>${finalSymbol}</td>
                        <td  contenteditable="true" id="BUYorderPrice${i}">${data[i].LATEST_PRICE}</td>
                        <td  style="display: ${action};">
                        <a class="btn btn-sm btn-success" style="display: ${action};"><i class="ti ti-pencil text-white email-action-icons-item" onclick="updateOrder(${i},'BUY',${data[i].ORDER_ID})"></i></a>
                        <a class="btn btn-sm btn-danger" style="display: ${del};"><i class="ti ti-x text-white email-action-icons-item" onclick="delOrder(${i},'BUY',${data[i].ORDER_ID})"></i></a>
                    </td>
                    `;
                    tableBody.appendChild(row);
                //});
                    }
                    
            } else {
                const noDataRow = document.createElement('tr');
                noDataRow.innerHTML = '<td colspan="2">No data available</td>';
                tableBody.appendChild(noDataRow);
            }
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fillData2(strt){
    try {
        let userData;
        const userDataString = sessionStorage.getItem('userData');
            if (userDataString) {
                userData = JSON.parse(userDataString);
            }
            if(userData.userType === 'Broker'){ action = 'none'; del = 'none';}
        if(userData.userType === 'Corp'){
            if(queryParams.symbol){
                let lnk = 'http://localhost:3000/order/symbol?symbol='+symbol+'&type=SELL';
                const response = await fetch(lnk); // Change the URL to your backend API endpoint
                const data = await response.json();

                const tableBody = document.getElementById('sellOrders');
                tableBody.innerHTML = ''; // Clear existing rows
                document.getElementById("actionColumnHeader2").style.display = '';
                document.getElementById("actionColumnHeader2").style.display = 'none';

        if (data) {
            //data.forEach(stock => {
                for(let i=10*strt;i<Math.min(10*(strt+1),data.length);i++){
                const row = document.createElement('tr');
                let stl;
                if(data[i].STATUS === 'SUCCESS')
                stl='success';
                if(data[i].STATUS === 'PENDING')
                stl='warning';
                if(data[i].STATUS === 'FAILURE')
                stl='danger';
                row.innerHTML = `
                    <td>${data[i].ORDER_ID}</td>
                    <td><span class="text-${stl}">${data[i].STATUS}</span></td>
                    <td>${data[i].TRANSACTION_TIME}</td>
                    <td contenteditable="true" id="SELLorderQntty${i}">${data[i].LATEST_QUANTITY }</td>
                    <td>${symbol}</td>
                    <td contenteditable="true" id="SELLorderPrice${i}">${data[i].LATEST_PRICE}</td>
                    <td  style="display: none;">
                    <a class="btn btn-sm btn-success" style="display: none;"><i class="ti ti-pencil text-white email-action-icons-item" onclick="updateOrder(${i},'SELL',${data[i].ORDER_ID}></i></a>
                    <a class="btn btn-sm btn-danger" style="display:  none;"><i class="ti ti-x text-white email-action-icons-item" onclick="delOrder(${i},'SELL',${data[i].ORDER_ID})"></i></a>
                   </td>
                `;
                tableBody.appendChild(row);

                }
        } else {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = '<td colspan="2">No data available</td>';
            tableBody.appendChild(noDataRow);
        }
            }
            else{
              document.getElementById("sellOrderListShowingButton").style.display = '';
              document.getElementById("sellOrderListShowingButton").style.display = 'none';
            }
        }
        else{
        let lnk,symFlag;
        symFlag=0;
        if(queryParams.userId)
        lnk = 'http://localhost:3000/order/userOrders?userId='+queryParams.userId+'&type=SELL';
        else{
        lnk = 'http://localhost:3000/order/symbol?symbol='+symbol+'&type=SELL';
        symFlag = 1;
        }
        const response = await fetch(lnk); // Change the URL to your backend API endpoint
        const data = await response.json();

        let flag = 0;
        let local_action = action;
        if((action === 'none') && (del === 'none') && (userData.userType !== 'Broker')){
          local_action = 'grid';
          flag = 1;
        }
        const tableBody = document.getElementById('sellOrders');
        tableBody.innerHTML = '';
        document.getElementById("actionColumnHeader2").style.display = '';
        document.getElementById("actionColumnHeader2").style.display = local_action;

        let finalSymbol;
        if (data) {
                for(let i=10*strt;i<Math.min(10*(strt+1),data.length);i++){
                  if(symFlag === 0){
                    finalSymbol = data[i].SYMBOL;
                   }
                   else{
                    finalSymbol = symbol;
                   }
                const row = document.createElement('tr');
                let stl;
                if(data[i].STATUS === 'SUCCESS')
                stl='success';
                if(data[i].STATUS === 'PENDING')
                stl='warning';
                if(data[i].STATUS === 'FAILURE')
                stl='danger';
                row.innerHTML = `
                    <td>${data[i].ORDER_ID}</td>
                    <td><span class="text-${stl}">${data[i].STATUS}</span></td>
                    <td>${data[i].TRANSACTION_TIME}</td>
                    <td contenteditable="true" id="SELLorderQntty${i}">${data[i].LATEST_QUANTITY }</td>
                    <td>${finalSymbol}</td>
                    <td contenteditable="true" id="SELLorderPrice${i}">${data[i].LATEST_PRICE}</td>
                    <td  style="display: ${local_action};">
                    <a class="btn btn-sm btn-success" style="display: ${local_action};"><i class="ti ti-pencil text-white email-action-icons-item" onclick="sellMid(${flag},${data[i].ORDER_ID},${i})"></i></a>
                    <a class="btn btn-sm btn-danger" style="display: ${del};"><i class="ti ti-x text-white email-action-icons-item" onclick="delOrder(${i},'SELL',${data[i].ORDER_ID})"></i></a>
                    </td>
                  `;
                  tableBody.appendChild(row);
                }
        } else {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = '<td colspan="2">No data available</td>';
            tableBody.appendChild(noDataRow);
        }
    }
}
    catch (error) {
        console.error('Error fetching data:', error);
    }
}

let data_cnt=0,data_cnt2=0;
fillData(data_cnt);
fillData2(data_cnt2);
function myPagination(i){
    data_cnt+=i;
    if(data_cnt < 0){
        data_cnt = 0;
    }
    if(data_cnt === 0){
        document.getElementById("orderTablePrevButton").style.display = "none";
    }
    else{
        document.getElementById("orderTablePrevButton").style.display = "block";
    }
    fillData(data_cnt);
}
function myPagination2(i){
    data_cnt2+=i;
    if(data_cnt2 < 0){
        data_cnt2 = 0;
    }
    if(data_cnt2 === 0){
        document.getElementById("orderTablePrevButton2").style.display = "none";
    }
    else{
        document.getElementById("orderTablePrevButton2").style.display = "block";
    }
    fillData2(data_cnt2);
}

function sellMid (flag,orId,num){
  if (flag === 1) {
    setSellOrderSuccess(orId);
} else {
    updateOrder(num,'SELL', orId);
}
}

async function updateOrder (num,type,orId){
  const userDataString = sessionStorage.getItem('userData');
  let userDataset;
  if (userDataString) {
      userDataset = JSON.parse(userDataString);
  }
    const price = document.getElementById(type+'orderPrice'+num).textContent;
    const quantity = document.getElementById(type+'orderQntty'+num).textContent;
    //const orId = document.getElementById('orderId'+num).textContent;

    const userData = {
      userId: userDataset.userId,
      orderId: orId,
      price: price,
      quantity: quantity,
    };

    try {
      const response = await fetch('http://localhost:3000/order/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        showOrderTableErrors(1,['Order successfully updated!'],'ALLOrderTableErrBox');
      } else {
          showOrderTableErrors(0,data.errors,'ALLOrderTableErrBox');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
}

async function delOrder (num,type,orId){
    const userDataString = sessionStorage.getItem('userData');
    let userDataset;
    if (userDataString) {
        userDataset = JSON.parse(userDataString);
    }
      //const orId = document.getElementById('orderId'+num).textContent;
  
      const userData = {
        userId: userDataset.userId,
        orderId: orId,
      };
  
      try {
        const response = await fetch('http://localhost:3000/order/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
          // const errbox = document.getElementById(type+'UpdateOrderErrBox');
          // const newDiv = document.createElement('div');
          //     newDiv.className = 'alert alert-success';
          //     newDiv.textContent = 'Order successfully deleted!';
          //     const closeButton = document.createElement('button');
          //         closeButton.className = 'close';
          //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
  
          //         closeButton.addEventListener('click', function () {
          //             newDiv.parentNode.removeChild(newDiv);
          //         });
          //         newDiv.appendChild(closeButton);
          //         errbox.appendChild(newDiv);
          showOrderTableErrors(1,['Order successfully deleted!'],'ALLOrderTableErrBox');
        } else {
          showOrderTableErrors(0,data.errors,'ALLOrderTableErrBox');
          //if(data.message === 'errors'){
            // const errbox = document.getElementById(type+'UpdateOrderErrBox');
            //   let cnt=0;
            //   data.errors.forEach(item => {
            //     const newDiv = document.createElement('div');
            //     newDiv.className = 'alert alert-danger';
            //     newDiv.textContent = item;
            //     const closeButton = document.createElement('button');
            //       closeButton.className = 'close';
            //       closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
  
            //       closeButton.addEventListener('click', function () {
            //           newDiv.parentNode.removeChild(newDiv);
            //       });
            //       newDiv.appendChild(closeButton);
            //     newDiv.id='err'+cnt;
            //     errbox.appendChild(newDiv);
            //     cnt+=1;
            //   });
          //}
          //console.error('Registration failed:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
  }


async function setSellOrderSuccess (orId){
    const userDataString = sessionStorage.getItem('userData');
    let userDataset;
    if (userDataString) {
        userDataset = JSON.parse(userDataString);
    }
      //const orId = document.getElementById('orderId'+num).textContent;
  
      const userData = {
        buyerId: userDataset.userId,
        orderId: orId,
      };
  
      try {
        const response = await fetch('http://localhost:3000/order/sell-order-success', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
          // const errbox = document.getElementById('SELLUpdateOrderErrBox');
          // const newDiv = document.createElement('div');
          //     newDiv.className = 'alert alert-success';
          //     newDiv.textContent = 'Order is successful!';
          //     const closeButton = document.createElement('button');
          //         closeButton.className = 'close';
          //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
  
          //         closeButton.addEventListener('click', function () {
          //             newDiv.parentNode.removeChild(newDiv);
          //         });
          //         newDiv.appendChild(closeButton);
          //         errbox.appendChild(newDiv);
          showOrderTableErrors(1,['Order is successful!'],'ALLOrderTableErrBox');
        } else {
          showOrderTableErrors(0,data.errors,'ALLOrderTableErrBox');
          //if(data.message === 'errors'){
            // const errbox = document.getElementById('SELLUpdateOrderErrBox');
            //   let cnt=0;
              // data.errors.forEach(item => {
              //   const newDiv = document.createElement('div');
              //   newDiv.className = 'alert alert-danger';
              //   newDiv.textContent = item;
              //   const closeButton = document.createElement('button');
              //     closeButton.className = 'close';
              //     closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
  
              //     closeButton.addEventListener('click', function () {
              //         newDiv.parentNode.removeChild(newDiv);
              //     });
              //     newDiv.appendChild(closeButton);
              //   newDiv.id='err'+cnt;
              //   errbox.appendChild(newDiv);
              //   cnt+=1;
              // });
          //}
          //console.error('Registration failed:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
  }


  async function setBuyOrderStatus (orId,stat){
    console.log("in the function......");
    const userDataString = sessionStorage.getItem('userData');
    let userDataset;
    if (userDataString) {
        userDataset = JSON.parse(userDataString);
    }
      //const orId = document.getElementById('orderId'+num).textContent;
  
      const userData = {
        corpId: userDataset.userId,
        orderId: orId,
        status: stat
      };
  
      try {
        const response = await fetch('http://localhost:3000/order/set-buy-order-status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
          showOrderTableErrors(1,['Order status is set!'],'ALLOrderTableErrBox');
          // const errbox = document.getElementById('BUYUpdateOrderErrBox');
          // const newDiv = document.createElement('div');
          //     newDiv.className = 'alert alert-success';
          //     newDiv.textContent = 'Order status is set!';
          //     const closeButton = document.createElement('button');
          //         closeButton.className = 'close';
          //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
  
          //         closeButton.addEventListener('click', function () {
          //             newDiv.parentNode.removeChild(newDiv);
          //         });
          //         newDiv.appendChild(closeButton);
          //         errbox.appendChild(newDiv);
        } else {
          showOrderTableErrors(0,data.errors,'ALLOrderTableErrBox');
          //if(data.message === 'errors'){
            // const errbox = document.getElementById('BUYUpdateOrderErrBox');
            //   let cnt=0;
            //   data.errors.forEach(item => {
            //     const newDiv = document.createElement('div');
            //     newDiv.className = 'alert alert-danger';
            //     newDiv.textContent = item;
            //     const closeButton = document.createElement('button');
            //       closeButton.className = 'close';
            //       closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
  
            //       closeButton.addEventListener('click', function () {
            //           newDiv.parentNode.removeChild(newDiv);
            //       });
            //       newDiv.appendChild(closeButton);
            //     newDiv.id='err'+cnt;
            //     errbox.appendChild(newDiv);
            //     cnt+=1;
            //   });
          //}
          //console.error('Registration failed:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
  }



function showOrderTableErrors(flag,errmsgs,id){
  const errbox = document.getElementById(id);
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

