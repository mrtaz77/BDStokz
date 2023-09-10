let id_global;

const userDataStringScript = sessionStorage.getItem('userData');
  let userDataset;
  if (userDataStringScript) {
      userDataset = JSON.parse(userDataStringScript);
  }



async function initiateProfManager(){
const queryParams = new URLSearchParams(window.location.search);

const nameParam = queryParams.get('name');
console.log("name param  is "+nameParam);
console.log("The link is "+'http://localhost:3000/user/profile/'+nameParam);
const response = await fetch('http://localhost:3000/user/profile/'+nameParam); 
const data = await response.json();


if(userDataset.username !== nameParam){
    if(userDataset.userType === 'Customer'){
        document.getElementById('accountDeleteButton').style.display = "none";
        document.getElementById('pwdAccountDelete').style.display = "none";
        document.getElementById('proceedAccountDelete').style.display = "none";
        document.getElementById('addBrokerButton').style.display = "block";
    }
    else if(userDataset.userType!== 'Admin'){
        document.getElementById('accountDeleteButton').style.display = "none";
        document.getElementById('pwdAccountDelete').style.display = "none";
        document.getElementById('proceedAccountDelete').style.display = "none";
        document.getElementById('addBrokerButton').style.display = "none";
    }
}



document.getElementById('profileUserName').textContent = data[0].NAME;
document.getElementById('profileUserType').textContent = data[0]["TYPE"];
//document.getElementById('profileDisplayPhn').textContent = data.contact[0];
document.getElementById('profileDisplayMail').textContent = data[0].EMAIL;


document.getElementById('accountDeleteButton').addEventListener("click", function(){
    document.getElementById('accountDeleteButton').style.display = "none";
    document.getElementById('pwdAccountDelete').style.display = "block";
    document.getElementById('proceedAccountDelete').style.display = "block";
});

document.getElementById('addBrokerButton').addEventListener("click", async function(){
    const errBoxGenInfo=document.getElementById('errBoxDeleteAccount');
    //const newValue = document.getElementById('symbolAccordionText').textContent;
    const userData = {
        userId:userDataset.userId,
        field: 'BROKER_ID',
        newValue:id_global
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
               showProfileUpdateErrors(1,['Broker added successfully!'],'errBoxDeleteAccount');
            }
        } else {
            showProfileUpdateErrors(0,data.errors,errBoxDeleteAccount);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
});

document.getElementById('proceedAccountDelete').addEventListener("click", async function(){
    const userDataString = sessionStorage.getItem('userData');
    let userDataset;
    if (userDataString) {
        userDataset = JSON.parse(userDataString);
    }
    if(userDataset.userType !== 'Admin'){
    const pwd = document.getElementById('pwdAccountDelete').value;

    const userData = {
      userId: data[0].USER_ID,
      password: pwd
    };

    try {
      const response = await fetch('http://localhost:3000/user/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        //document.getElementById('profileCard').style.display = "none";
        window.location.href = 'http://localhost:3000/BdStokz_main/login/login.html';
      } else {
            showProfileUpdateErrors(0,data.errors,'errBoxDeleteAccount');
        }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  else{
    const pwd = document.getElementById('pwdAccountDelete').value;

    const userData = {
      deleterId: userDataset.userId,
      userId: data[0].USER_ID,
      password: pwd
    };

    try {
      const response = await fetch('http://localhost:3000/user/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        document.getElementById('profileCard').style.display = "none";
        //window.location.href = 'http://localhost:3000/BdStokz_main/login/login.html';
      } else {
            showProfileUpdateErrors(0,data.errors,'errBoxDeleteAccount');
        }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
}
);

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
            // const newDiv = document.createElement('div');
            // newDiv.className = 'alert alert-success';
            // newDiv.textContent = 'Contact successfully deleted!';
            // const closeButton = document.createElement('button');
            //     closeButton.className = 'close';
            //     closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

            //     closeButton.addEventListener('click', function () {
            //         newDiv.parentNode.removeChild(newDiv);
            //     });
            //     newDiv.appendChild(closeButton);
            // document.getElementById('errorBoxContactInfo').appendChild(newDiv);
            showProfileUpdateErrors(1,['Contact successfully deleted!'],'errorBoxContactInfo');
          }
          else{
           
          }
        } else {
            // //const data = await response.json();
            // const errbox = document.getElementById('errorBoxContactInfo');
            // let cnt=0;
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
            showProfileUpdateErrors(0,data.errors,'errorBoxContactInfo');
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
                // const newDiv = document.createElement('div');
                // newDiv.className = 'alert alert-success';
                // newDiv.textContent ='ACCOUNT_NO successfully updated!';
                // const closeButton = document.createElement('button');
                // closeButton.className = 'close';
                // closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                // closeButton.addEventListener('click', function () {
                //     newDiv.parentNode.removeChild(newDiv);
                // });
                // newDiv.appendChild(closeButton);
                // errBoxGenInfo.appendChild(newDiv);
                showProfileUpdateErrors(1,['Account No successfully updated!'],'bankACEditErrorBox');
            }
        } else {
            // data.errors.forEach(element => {
            //         // const newDiv = document.createElement('div');
            //         // newDiv.className = 'alert alert-danger';
            //         // newDiv.textContent = element;
            //         // const closeButton = document.createElement('button');
            //         // closeButton.className = 'close';
            //         // closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
            //         // closeButton.addEventListener('click', function () {
            //         //     newDiv.parentNode.removeChild(newDiv);
            //         // });
            //         // newDiv.appendChild(closeButton);
            //         // errBoxGenInfo.appendChild(newDiv);
            // });
            showProfileUpdateErrors(0,data.errors,'bankACEditErrorBox');
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
                // const newDiv = document.createElement('div');
                // newDiv.className = 'alert alert-success';
                // newDiv.textContent ='SECTOR successfully updated!';
                // const closeButton = document.createElement('button');
                // closeButton.className = 'close';
                // closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                // closeButton.addEventListener('click', function () {
                //     newDiv.parentNode.removeChild(newDiv);
                // });
                // newDiv.appendChild(closeButton);
                // errBoxGenInfo.appendChild(newDiv);
                showProfileUpdateErrors(1,['Sector successfully updated!'],'sectorEditErrorBox');
            }
        } else {
            // data.errors.forEach(element => {
            //         const newDiv = document.createElement('div');
            //         newDiv.className = 'alert alert-danger';
            //         newDiv.textContent = element;
            //         const closeButton = document.createElement('button');
            //         closeButton.className = 'close';
            //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
            //         closeButton.addEventListener('click', function () {
            //             newDiv.parentNode.removeChild(newDiv);
            //         });
            //         newDiv.appendChild(closeButton);
            //         errBoxGenInfo.appendChild(newDiv);
            // });
            showProfileUpdateErrors(0,data.errors,'sectorEditErrorBox');
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
                // const newDiv = document.createElement('div');
                // newDiv.className = 'alert alert-success';
                // newDiv.textContent ='SYMBOL successfully updated!';
                // const closeButton = document.createElement('button');
                // closeButton.className = 'close';
                // closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                // closeButton.addEventListener('click', function () {
                //     newDiv.parentNode.removeChild(newDiv);
                // });
                // newDiv.appendChild(closeButton);
                // errBoxGenInfo.appendChild(newDiv);
                showProfileUpdateErrors(1,['SYMBOL successfully updated!'],'symbolEditErrorBox');
            }
        } else {
            // data.errors.forEach(element => {
            //         const newDiv = document.createElement('div');
            //         newDiv.className = 'alert alert-danger';
            //         newDiv.textContent = element;
            //         const closeButton = document.createElement('button');
            //         closeButton.className = 'close';
            //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
            //         closeButton.addEventListener('click', function () {
            //             newDiv.parentNode.removeChild(newDiv);
            //         });
            //         newDiv.appendChild(closeButton);
            //         errBoxGenInfo.appendChild(newDiv);
            // });
            showProfileUpdateErrors(0,data.errors,'symbolEditErrorBox');
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
                // const newDiv = document.createElement('div');
                // newDiv.className = 'alert alert-success';
                // newDiv.textContent ='EXPERTISE successfully updated!';
                // const closeButton = document.createElement('button');
                // closeButton.className = 'close';
                // closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                // closeButton.addEventListener('click', function () {
                //     newDiv.parentNode.removeChild(newDiv);
                // });
                // newDiv.appendChild(closeButton);
                // errBoxGenInfo.appendChild(newDiv);
                showProfileUpdateErrors(1,['EXPERTISE successfully updated!'],'expertiseEditErrorBox');
            }
        } else {
            // data.errors.forEach(element => {
            //         const newDiv = document.createElement('div');
            //         newDiv.className = 'alert alert-danger';
            //         newDiv.textContent = element;
            //         const closeButton = document.createElement('button');
            //         closeButton.className = 'close';
            //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
        
            //         closeButton.addEventListener('click', function () {
            //             newDiv.parentNode.removeChild(newDiv);
            //         });
            //         newDiv.appendChild(closeButton);
            //         errBoxGenInfo.appendChild(newDiv);
            // });
            showProfileUpdateErrors(0,data.errors,'expertiseEditErrorBox');
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
            // const newDiv = document.createElement('div');
            // newDiv.className = 'alert alert-success';
            // newDiv.textContent = 'Contact successfully updated!';
            // const closeButton = document.createElement('button');
            //     closeButton.className = 'close';
            //     closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

            //     closeButton.addEventListener('click', function () {
            //         newDiv.parentNode.removeChild(newDiv);
            //     });
            //     newDiv.appendChild(closeButton);
            // document.getElementById('errorBoxContactInfo').appendChild(newDiv);
            showProfileUpdateErrors(1,['Contact successfully updated!'],'errorBoxContactInfo');
          }
          else{
           
          }
        } else {
            //const data = await response.json();
            // const errbox = document.getElementById('errorBoxContactInfo');
            // let cnt=0;
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
            showProfileUpdateErrors(0,data.errors,'errorBoxContactInfo');
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
                                // const newDiv = document.createElement('div');
                                // newDiv.className = 'alert alert-success';
                                // newDiv.textContent = user[i]+' successfully updated!';
                                // const closeButton = document.createElement('button');
                                // closeButton.className = 'close';
                                // closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

                                // closeButton.addEventListener('click', function () {
                                //     newDiv.parentNode.removeChild(newDiv);
                                // });
                                // newDiv.appendChild(closeButton);
                                // errBoxGenInfo.appendChild(newDiv);
                                showProfileUpdateErrors(1,[user[i]+' successfully updated!'],'errBoxGenInfoUpdate',0);
                            }
                        } else {
                            // data.errors.forEach(element => {
                            //         const newDiv = document.createElement('div');
                            //         newDiv.className = 'alert alert-danger';
                            //         newDiv.textContent = element;
                            //         const closeButton = document.createElement('button');
                            //         closeButton.className = 'close';
                            //         closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)
                        
                            //         closeButton.addEventListener('click', function () {
                            //             newDiv.parentNode.removeChild(newDiv);
                            //         });
                            //         newDiv.appendChild(closeButton);
                            //         errBoxGenInfo.appendChild(newDiv);
                            // });
                            showProfileUpdateErrors(0,data.errors,'errBoxGenInfoUpdate',0);
                        }
                    } catch (error) {
                        console.error(`An error occurred while updating ${user[i]}:`, error);
                    }
                }
            }
        }
        
});

document.getElementById('addAdminButton').addEventListener("click",async function(){
    let usID = id_global;
    const newContact = document.getElementById('addAdminForm').value;
    const userData = {
        adminId: usID,
        empName: newContact,
    };
    try {
        const response = await fetch('http://localhost:3000/admin/addAdmin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
          //if(data.message === 'Contact deleted successfully'){
            // const newDiv = document.createElement('div');
            // newDiv.className = 'alert alert-success';
            // newDiv.textContent = 'Admin successfully added!';
            // const closeButton = document.createElement('button');
            //     closeButton.className = 'close';
            //     closeButton.innerHTML = '&times;'; // The times symbol represents a cross (X)

            //     closeButton.addEventListener('click', function () {
            //         newDiv.parentNode.removeChild(newDiv);
            //     });
            //     newDiv.appendChild(closeButton);
            // document.getElementById('errorBoxAddAdmin').appendChild(newDiv);

          // //} vul bracket eta
          showProfileUpdateErrors(1,['Admin successfully added!'],'errorBoxAddAdmin');
          
        } else {
            //const data = await response.json();
            // const errbox = document.getElementById('errorBoxAddAdmin');
            // let cnt=0;
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
            showProfileUpdateErrors(0,data.errors,'errorBoxAddAdmin');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
});

function showProfileUpdateErrors(flag,errmsgs,id,cleaningFlag = 1){
    const errbox = document.getElementById(id);
    if(cleaningFlag === 1)
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