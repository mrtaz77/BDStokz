// document.addEventListener('DOMContentLoaded', function() {
//     const submitButton = document.getElementById('registerButton');

//     submitButton.addEventListener('click', async function() {
//       const name = document.getElementById('Name-reg').value;
//       const email = document.getElementById('Email-reg').value;
//       const contact = document.getElementById('Contact-reg').value;
//       const password = document.getElementById('Password-reg').value;
//       const street = document.getElementById('Street-reg').value;
//       const streetNumber = document.getElementById('St No.-reg').value;
//       const city = document.getElementById('City-reg').value;
//       const country = document.getElementById('Country-reg').value;
//       const zip = document.getElementById('Zip-reg').value;
//       const userType = document.getElementById('UserType-reg').value;

//       const userData = {
//         name: name,
//         email: email,
//         contact: contact,
//         password: password,
//         street: street,
//         streetNumber: streetNumber,
//         city: city,
//         country: country,
//         zip: zip,
//         userType: userType
//       };

//       try {
//         const response = await fetch('http://localhost:3000/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(userData)
//         });

//         if (response.ok) {
//           const responseData = await response.json();
//           console.log('Registration successful:', responseData);
//         } else {
//           console.error('Registration failed:', response.statusText);
//         }
//       } catch (error) {
//         console.error('An error occurred:', error);
//       }
//     });
//   });


//document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('registerButton');
  
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
  
      const userData = {
        name: name,
        email: email,
        contact: contact,
        password: password,
        street: street,
        streetNumber: streetNumber,
        city: city,
        country: country,
        zip: zip,
        userType: userType
      };
  
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log('Registration successful:', responseData);
  
          // Redirect to another page with query parameters
        //   const queryParams = new URLSearchParams();
        //   queryParams.append('name', name);
        //   queryParams.append('email', email);
        //   queryParams.append('userType', userType);
          const redirectURL = '../index/index.html'// + queryParams.toString();
          window.location.href = redirectURL;
        } else {
          console.error('Registration failed:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });
  //});
  