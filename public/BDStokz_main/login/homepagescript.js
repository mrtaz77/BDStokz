
let errmsgs = [];
var cnt=1;
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('registerButton');
    // let ussTYPE = ['Customer','Broker','Corp'];
    // let sectors = ['Technology','Healthcare','Financial','Consumer Goods','Energy','Retail','Utilities','Real Estate','Telecommunication','Transportation'];
    submitButton.addEventListener('click', async function() {
      const name = document.getElementById('Name-reg').value;
      const email = document.getElementById('Email-reg').value;
      const contact = document.getElementById('Contact-reg').value;
      const password = document.getElementById('Password-reg').value;
      const street = document.getElementById('Street-reg').value;
      const streetNumber = document.getElementById('St No.-reg').value;
      const city = document.getElementById('City-reg').value;
      const country = document.getElementById('Country-reg').value;
      const zip = document.getElementById('Zip-reg').value;
      const userType = document.getElementById('UserType-reg').value;
      const brokerLicense = document.getElementById('brokerLicense').value;
      const custAcNo = document.getElementById('custAcNoinput').value; 
      const corpRegNo = document.getElementById('corpRegNoinput').value; 
      const brokerExpertiseinput = document.getElementById('brokerExpertiseinput').value;
      const corpSector = document.getElementById('corpSectorinput').value;
      const refName = document.getElementById('refererUserNameinput').value;
      const userData = {
        name: name,
        email: email,
        contact: [contact],
        pwd: password,
        streetName: street,
        streetNo: streetNumber,
        city: city,
        country: country,
        zip: zip,
        type: userType,
        accountNo: custAcNo,
        brokerId: null,
        refererName: refName,
        licenseNo: brokerLicense,
        commissionPCT :null,
        expertise: brokerExpertiseinput,
        corpRegNo: corpRegNo,
        sector: corpSector,
        confirmPwd: password,
      };
      UserType=userData.userType;
      try {
        const response = await fetch('http://localhost:3000/reg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
          // const data = await response.json();
          // if(data.message === 'errors'){
          //   const formBody = document.getElementById('regFormholder');
          //   data.err.forEach(item => {
          //     const newDiv = document.createElement('div');
          //     newDiv.className = 'alert alert-danger';
          //     newDiv.textContent = item;
          //     newDiv.id='err'+cnt;
          //     formBody.appendChild(newDiv);
          //     errmsgs.push('err'+cnt);
          //     cnt+=1;
          //   });
          // }
          //else{
          const regSuccess = document.getElementById('regSuccess');
          regSuccess.style.display = 'block'; 
          //}
        } else {
          //console.error('Registration failed:', response.statusText);
          ShowRegErrors(0,data.err,'regFormholder',0);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
  });
       const formCrossButton = document.getElementById('formCross');
        const formCloseButton = document.getElementById('formClose');

        formCrossButton.addEventListener('click', () => {
            clearFormFields();
        });

        formCloseButton.addEventListener('click', () => {
            clearFormFields();
        });

        function clearFormFields() {
          const elementIds = [
            'Name-reg',
            'Email-reg',
            'Contact-reg',
            'Password-reg',
            'Street-reg',
            'St No.-reg',
            'City-reg',
            'Country-reg',
            'Zip-reg',
            'UserType-reg',
            'brokerLicense',
            'custAcNoinput',
            'corpRegNoinput',
            'brokerExpertiseinput',
            'corpSectorinput'
        ];

            elementIds.forEach(elementId => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.value = '';
                }
            });
            errmsgs.forEach(elementId => {
              const element = document.getElementById(elementId);
              //console.log(element);
              if(element)
              element.remove();
          });
            // const elementsToRemove = document.querySelectorAll('.alert.alert-danger');
            // if (elementsToRemove.length > 0) {
            //     elementsToRemove[elementsToRemove.length - 1].remove();
            // }
        }
      const brokerExpertiseSection = document.getElementById('brokerExpertise');
      const custAccountNoSection = document.getElementById('custAccountNo');
      const corpRegNoSection = document.getElementById('corpRegNo');
      const corpSectorSection = document.getElementById('corpSector');
      const userTypeSelect = document.getElementById('UserType-reg');
      const brokerLicenseSection = document.getElementById('brokerLicenseSec');
      const refererName = document.getElementById('refererUserName');

      userTypeSelect.addEventListener('change', () => {
          const selectedUserType = userTypeSelect.value;

          brokerLicenseSection.style.display = 'none';
          brokerExpertiseSection.style.display = 'none';
          custAccountNoSection.style.display = 'none';
          corpRegNoSection.style.display = 'none';
          corpSectorSection.style.display = 'none';
          refererName.style.display = 'none';
          
          console.log("you are a broker");
          // Reset display for all sections
      
          // Show relevant sections based on selected user type
          if (selectedUserType === 'Broker') { // Broker
              brokerLicenseSection.style.display = 'block';
              brokerExpertiseSection.style.display = 'block';
              console.log("you are a broker");
          } else if (selectedUserType === 'Corp') { // Corporation
              corpRegNoSection.style.display = 'block';
              corpSectorSection.style.display = 'block';
          } else if (selectedUserType === 'Customer') { // Customer
              custAccountNoSection.style.display = 'block';
              refererName.style.display = 'block';
          }
      });
     
    document.getElementById('signinbutton').addEventListener('click', async () => {
        const username = document.getElementById('loginusername').value;
        const password = document.getElementById('loginpass').value;

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username,password })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.message === 'Login successful') {
                // Redirect to another page on successful login
                const queryParams = new URLSearchParams();
                queryParams.append('name', username);
                queryParams.append('usertype',data.userType);
                const userData = { username:username , userType:data.userType, userId:data.userId};
                sessionStorage.setItem('userData', JSON.stringify(userData));
                window.location.href = 'http://localhost:3000/BdStokz_main/index/index.html' //+ '?' +queryParams.toString(); // Adjust the URL as needed
            }
          //   else {
          //     // Show error alert if login is unsuccessful
          //     const wrongCredAlert = document.getElementById('wrongCredLogin');
          //     wrongCredAlert.style.display = 'block';
          // }
        } 
        else if (response.status === 400) {
          // Show error alert for wrong credentials if server returns 400
          const wrongCredAlert = document.getElementById('wrongCredLogin');
          wrongCredAlert.style.display = 'block'; 
        }
        else {
            const data = await response.json();
            // Display errors or handle unsuccessful login here
        }
    });
    
    



    document.getElementById('errmsgloginclose').addEventListener('click', async () => {
      const wrongCredAlert = document.getElementById('wrongCredLogin');
          wrongCredAlert.style.display = 'none';
  });

  function ShowRegErrors(flag,errmsgs,id,cleaningFlag=1){
    const errbox = document.getElementById(id);
    if(cleaningFlag ===  1)
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

  