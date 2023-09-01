let id_global;

async function initiateProfManager(){
const queryParams = new URLSearchParams(window.location.search);

const nameParam = queryParams.get('name');
console.log("name param  is "+nameParam);
console.log("The link is "+'http://localhost:3000/user/profile/'+nameParam);
const response = await fetch('http://localhost:3000/user/profile/'+nameParam); 
const data = await response.json();

// console.log("In profile manager.....");
// console.log("username is "+data.NAME);


document.getElementById('profileUserName').textContent = data[0].NAME;
document.getElementById('profileUserType').textContent = data[0]["TYPE"];
//document.getElementById('profileDisplayPhn').textContent = data.contact[0];
document.getElementById('profileDisplayMail').textContent = data[0].EMAIL;

try{
const response3 = await fetch('http://localhost:3000/user/contact/'+nameParam);
const contactList = await response3.json();
const contactOptionSelect = document.getElementById('contactSelectForm');

document.getElementById('profileDisplayPhn').textContent = contactList[0].CONTACT;

contactList.forEach(element => {
    const newOption = document.createElement("option");
    newOption.value = element.CONTACT;
    newOption.text = element.CONTACT;
    contactOptionSelect.appendChild(newOption);
});
}
catch(errors){
    console.log("error occured while reading contactlist of the user "+data[0].NAME);
    console.log("the error is "+errors);
}

const addContactBtn = document.getElementById('contactAddButton');
const delContactBtn = document.getElementById('contactDeleteButton');
let id = data[0].USER_ID;
id_global = id;

addContactBtn.addEventListener('click', function(){
    //console.log("In the event listener...");
    let usID = id;
    const newContact = document.getElementById('newContactInput').value;
    const userData = {
        userId: usID,
        contact: newContact,
    };
     console.log("printing user data...");
     console.log(userData.contact);
    updateContact(userData);
});

delContactBtn.addEventListener('click', async function(){
    let usID = id;
    const newContact = document.getElementById('contactSelectForm').value;
    const userData = {
        userId: usID,
        contact: newContact,
    };
    try {
        const response = await fetch('http://localhost:3000/user/delContact', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
          if(data.message === 'Contact deleted successfully'){
            const newDiv = document.createElement('div');
            newDiv.className = 'alert alert-success';
            newDiv.textContent = 'Contact successfully deleted!';
            const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
            document.getElementById('errorBoxContactInfo').appendChild(newDiv);
          }
          else{
           
          }
        } else {
            //const data = await response.json();
            const errbox = document.getElementById('errorBoxContactInfo');
            let cnt=0;
            data.errors.forEach(item => {
              const newDiv = document.createElement('div');
              newDiv.className = 'alert alert-danger';
              newDiv.textContent = item;
              const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
              newDiv.id='err'+cnt;
              errbox.appendChild(newDiv);
              cnt+=1;
            });
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
});

document.getElementById('editBankAcBtn').addEventListener('click', async function(){
    // let usID = id;
    const errBoxGenInfo=document.getElementById('bankACEditErrorBox');
    const newValue = document.getElementById('custBankAcNo').textContent;
    const userData = {
        userId:id_global,
        field: 'ACCOUNT_NO',
        newValue:newValue
    };
    try {
        const response = await fetch('http://localhost:3000/user/updateProfile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
       });
        const data = await response.json();
        if (response.ok) {
            if(data.message === 'User info updated successfully' ){
                const newDiv = document.createElement('div');
                newDiv.className = 'alert alert-success';
                newDiv.textContent ='ACCOUNT_NO successfully updated!';
                const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
                errBoxGenInfo.appendChild(newDiv);
            }
        } else {
            data.errors.forEach(element => {
                    const newDiv = document.createElement('div');
                    newDiv.className = 'alert alert-danger';
                    newDiv.textContent = element;
                    const closeButton = document.createElement('button');
                    closeButton.className = 'close';
                    closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
                    closeButton.addEventListener('click', function () {
                        newDiv.parentNode.removeChild(newDiv);
                    });
                    newDiv.appendChild(closeButton);
                    errBoxGenInfo.appendChild(newDiv);
            });
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
});

document.getElementById('editCorpSectorBtn').addEventListener('click', async function(){
    // let usID = id;
    const errBoxGenInfo=document.getElementById('sectorEditErrorBox');
    const newValue = document.getElementById('sectorAccordionText').textContent;
    const userData = {
        userId:id_global,
        field: 'SECTOR',
        newValue:newValue
    };
    try {
        const response = await fetch('http://localhost:3000/user/updateProfile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
       });
        const data = await response.json();
        if (response.ok) {
            if(data.message === 'User info updated successfully' ){
                const newDiv = document.createElement('div');
                newDiv.className = 'alert alert-success';
                newDiv.textContent ='SECTOR successfully updated!';
                const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
                errBoxGenInfo.appendChild(newDiv);
            }
        } else {
            data.errors.forEach(element => {
                    const newDiv = document.createElement('div');
                    newDiv.className = 'alert alert-danger';
                    newDiv.textContent = element;
                    const closeButton = document.createElement('button');
                    closeButton.className = 'close';
                    closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
                    closeButton.addEventListener('click', function () {
                        newDiv.parentNode.removeChild(newDiv);
                    });
                    newDiv.appendChild(closeButton);
                    errBoxGenInfo.appendChild(newDiv);
            });
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
});

document.getElementById('editCorpSymbolBtn').addEventListener('click', async function(){
    // let usID = id;
    const errBoxGenInfo=document.getElementById('symbolEditErrorBox');
    const newValue = document.getElementById('symbolAccordionText').textContent;
    const userData = {
        userId:id_global,
        field: 'SYMBOL',
        newValue:newValue
    };
    try {
        const response = await fetch('http://localhost:3000/user/updateProfile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
       });
        const data = await response.json();
        if (response.ok) {
            if(data.message === 'User info updated successfully' ){
                const newDiv = document.createElement('div');
                newDiv.className = 'alert alert-success';
                newDiv.textContent ='SYMBOL successfully updated!';
                const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
                errBoxGenInfo.appendChild(newDiv);
            }
        } else {
            data.errors.forEach(element => {
                    const newDiv = document.createElement('div');
                    newDiv.className = 'alert alert-danger';
                    newDiv.textContent = element;
                    const closeButton = document.createElement('button');
                    closeButton.className = 'close';
                    closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
                    closeButton.addEventListener('click', function () {
                        newDiv.parentNode.removeChild(newDiv);
                    });
                    newDiv.appendChild(closeButton);
                    errBoxGenInfo.appendChild(newDiv);
            });
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
});

document.getElementById('editExpertiseBtn').addEventListener('click', async function(){
    // let usID = id;
    const errBoxGenInfo=document.getElementById('expertiseEditErrorBox');
    const newValue = document.getElementById('brokerExpertiseAccordionText').textContent;
    const userData = {
        userId:id_global,
        field: 'EXPERTISE',
        newValue:newValue
    };
    try {
        const response = await fetch('http://localhost:3000/user/updateProfile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
       });
        const data = await response.json();
        if (response.ok) {
            if(data.message === 'User info updated successfully' ){
                const newDiv = document.createElement('div');
                newDiv.className = 'alert alert-success';
                newDiv.textContent ='EXPERTISE successfully updated!';
                const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
                errBoxGenInfo.appendChild(newDiv);
            }
        } else {
            data.errors.forEach(element => {
                    const newDiv = document.createElement('div');
                    newDiv.className = 'alert alert-danger';
                    newDiv.textContent = element;
                    const closeButton = document.createElement('button');
                    closeButton.className = 'close';
                    closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
                    closeButton.addEventListener('click', function () {
                        newDiv.parentNode.removeChild(newDiv);
                    });
                    newDiv.appendChild(closeButton);
                    errBoxGenInfo.appendChild(newDiv);
            });
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
});


if(data[0]["TYPE"] === 'Admin'){
    document.getElementById('bankACC').style.display = "none";
    document.getElementById('referCount').style.display = "none";
    document.getElementById('details').style.display = "none";

    const response2 = await fetch('http://localhost:3000/admin/allEmployees/');
    const empList = await response2.json();

    const optionsSelect = document.getElementById('addAdminForm');
    empList.forEach(element => {
        const newOption = document.createElement("option");
        newOption.value = element.NAME;
        newOption.text = element.NAME;
        optionsSelect.appendChild(newOption);
    });


}
else if(data[0]["TYPE"] === 'Customer'){
    document.getElementById('addAdmin').style.display = "none";
    document.getElementById('details').style.display = "none";

    document.getElementById('custBankAcNo').textContent = data[0].ACCOUNT_NO;
    document.getElementById('referCountText').textContent = data[0].REFER_COUNT;
}

else if(data[0]["TYPE"] === 'Corp'){
    document.getElementById('addAdmin').style.display = "none";
    document.getElementById('bankACC').style.display = "none";
    document.getElementById('referCount').style.display = "none";

    document.getElementById('licenseNoAccordion').style.display = "none";
    document.getElementById('brokerExpertiseAccordion').style.display = "none";
    document.getElementById('commissionPCTAccordion').style.display = "none";

    document.getElementById('corpRegNoAccordionText').textContent = data[0].CORP_REG_NO;
    document.getElementById('sectorAccordionText').textContent = data[0].SECTOR;
    document.getElementById('symbolAccordionText').textContent = data[0].SYMBOL;
}
else if(data[0]["TYPE"] === 'Broker'){
    document.getElementById('addAdmin').style.display = "none";
    document.getElementById('bankACC').style.display = "none";
    document.getElementById('referCount').style.display = "none";

    document.getElementById('licenseNoAccordionText').textContent = data[0].LICENSE_NO;
    document.getElementById('brokerExpertiseAccordionText').textContent = data[0].EXPERTISE;
    document.getElementById('commissionPCTAccordionText').textContent = data[0].COMMISSION_PCT;

    document.getElementById('corpRegNoAccordion').style.display = "none";
    document.getElementById('sectorAccordion').style.display = "none";
    document.getElementById('symbolAccordion').style.display = "none";
}

document.getElementById('Name-reg').placeholder = data[0].NAME;
document.getElementById('Email-reg').placeholder = data[0].EMAIL;
document.getElementById('Street-reg').placeholder = data[0].STREET_NAME;
document.getElementById('St No.-reg').placeholder = data[0].STREET_NO;
document.getElementById('City-reg').placeholder = data[0].CITY;
document.getElementById('Country-reg').placeholder = data[0].COUNTRY;
document.getElementById('Zip-reg').placeholder = data[0].ZIP;
}
initiateProfManager();
async function updateContact(userData){ 
    try {
        const response = await fetch('http://localhost:3000/user/addContact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
          if(data.message === 'User info updated successfully'){
            const newDiv = document.createElement('div');
            newDiv.className = 'alert alert-success';
            newDiv.textContent = 'Contact successfully updated!';
            const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
            document.getElementById('errorBoxContactInfo').appendChild(newDiv);
          }
          else{
           
          }
        } else {
            //const data = await response.json();
            const errbox = document.getElementById('errorBoxContactInfo');
            let cnt=0;
            data.errors.forEach(item => {
              const newDiv = document.createElement('div');
              newDiv.className = 'alert alert-danger';
              newDiv.textContent = item;
              const closeButton = document.createElement('button');
                closeButton.className = 'close';
                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                closeButton.addEventListener('click', function () {
                    newDiv.parentNode.removeChild(newDiv);
                });
                newDiv.appendChild(closeButton);
              newDiv.id='err'+cnt;
              errbox.appendChild(newDiv);
              cnt+=1;
            });
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
}
document.getElementById('updateGenInfo').addEventListener("click", async function(){
    const elemlist = ["Name-reg","Email-reg","St No.-reg","Street-reg","City-reg","Country-reg","Zip-reg"];
    const user = [`NAME`,`EMAIL`,`STREET_NO`,`STREET_NAME`,`CITY`,`COUNTRY`,`ZIP`];
        for (let i = 0; i < elemlist.length; i++) {
            const element = document.getElementById(elemlist[i]);
            if (element) {
                const newValue = element.value;
            if(newValue){
                const body = {
                    userId:id_global,
                    field: user[i],
                    newValue:newValue
                };
    
                    try {
                        const response = await fetch('http://localhost:3000/user/updateProfile', {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(body)
                        });

                        const data = await response.json();
                        const errBoxGenInfo = document.getElementById('errBoxGenInfoUpdate');
                        if (response.ok) {
                            if(data.message === 'User info updated successfully' ){
                                const newDiv = document.createElement('div');
                                newDiv.className = 'alert alert-success';
                                newDiv.textContent = user[i]+' successfully updated!';
                                const closeButton = document.createElement('button');
                                closeButton.className = 'close';
                                closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                                closeButton.addEventListener('click', function () {
                                    newDiv.parentNode.removeChild(newDiv);
                                });
                                newDiv.appendChild(closeButton);
                                errBoxGenInfo.appendChild(newDiv);
                            }
                        } else {
                            data.errors.forEach(element => {
                                    const newDiv = document.createElement('div');
                                    newDiv.className = 'alert alert-danger';
                                    newDiv.textContent = element;
                                    const closeButton = document.createElement('button');
                                    closeButton.className = 'close';
                                    closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
                        
                                    closeButton.addEventListener('click', function () {
                                        newDiv.parentNode.removeChild(newDiv);
                                    });
                                    newDiv.appendChild(closeButton);
                                    errBoxGenInfo.appendChild(newDiv);
                            });
                        }
                    } catch (error) {
                        console.error(`An error occurred while updating ${user[i]}:`, error);
                    }
                }
            }
        }
        
});
