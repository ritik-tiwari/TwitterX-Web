const toggleButtons = document.querySelectorAll('.toggle-btn');
const formSections = document.querySelectorAll('.form-section');

function checkTokenValidity() {
    const token = localStorage.getItem('Token');
  
    if (!token) {
      // Token not found in localStorage
      return;
    }
  
    fetch('http://localhost:3000/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 200) {
        location.replace('search')
        console.log('Token is valid');
      } else {
        // Token is invalid, reload the page
        ;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      location.reload(); // Reload the page on error
    });
  }
  
  // Call the function to check token validity when the page loads
  checkTokenValidity();
  



toggleButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        toggleButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        formSections.forEach((section) => section.classList.remove('active'));
        formSections[index].classList.add('active');
    });
});

// Set the default section to "login"
toggleButtons[1].click();
// Select the "Signup" button
const signupButton = document.querySelector('.signup-btn');

// Add an event listener to the "Signup" button
signupButton.addEventListener('click', () => {
    // Get the values from the input fields
    const mail = document.querySelector('.signup input[placeholder="Email"]').value;
    const nickname = document.querySelector('.signup input[placeholder="Name"]').value;
    const username = document.querySelector('.signup input[placeholder="Username"]').value;
    const password = document.querySelector('.signup input[placeholder="Password"]').value;

    // Create an object with the user's data
    const userObject = {
        "username": username,
        "password": password,
        "name": nickname,
        "email":mail
    };

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(userObject);

    // Store the JSON string in local storage using the username as the key
    fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userObject)
})
.then(response => response.json())
.then(data => alert(data.message))
.catch(error => console.error('Error:', error));
    // Clear the input fields after signup
    document.querySelector('.signup input[placeholder="Nickname"]').value = '';
    document.querySelector('.signup input[placeholder="Username"]').value = '';
    document.querySelector('.signup input[placeholder="Password"]').value = '';
});
// Select the "Login" button
const loginButton = document.querySelector('.login-btn');

// Add an event listener to the "Login" button
loginButton.addEventListener('click', () => {
    // Get the values from the input fields
    const username = document.querySelector('.login input[placeholder="Username OR Email"]').value;
    const password = document.querySelector('.login input[placeholder="Password"]').value;

    // Retrieve user data from local storage
   const userob = {"usernameOrEmail":username,"password":password}
   fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userob)
})
.then(response => {
    if (response.status === 401) {
        // Unauthorized, alert the error message
        response.json().then(data => alert(data.message));
    } else if (response.status === 200) {
        localStorage.setItem("username",username)
        // Success, store the token in local storage and redirect to "search" page
        response.json().then(data => {
            localStorage.setItem("Token", data.token);
            location.replace("search");
        });
    } else {
        // Handle other response codes here
        console.error('Unexpected response:', response);
    }
})
.catch(error => console.error('Error:', error));

    // Clear the input fields after login
    document.querySelector('.login input[placeholder="Password"]').value = '';

    

});
