function logout(){
  localStorage.clear();
  location.replace("..")
}
localStorage.setItem('graph_data','')
function checkTokenValidity() {
    const token = localStorage.getItem('Token');
  
    if (!token) {
      // Token not found in localStorage
      location.replace('..');
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
        // Token is valid
        console.log('Token is valid');
      } else {
        // Token is invalid, reload the page
        location.replace('..');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      location.reload(); // Reload the page on error
    });
  }
  
  // Call the function to check token validity when the page loads
  checkTokenValidity();
  



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-btn").addEventListener("click", function () {
        // Get the query from the input field
        const bttn=document.getElementById("login-btn")
        bttn.disabled=true
        bttn.style.backgroundColor="grey"
        const query = document.querySelector("input[type=text]").value;
        localStorage.setItem("query",query)
        
        // Display initial message
        const waitmsg = document.getElementById("waitmsg");
        waitmsg.innerText = "Please wait...";
        waitmsg.innerText = "Fetching tweets...";
        setTimeout(() => {
            waitmsg.innerText = "Drawing graph...";
            setTimeout(() => {
                waitmsg.innerText = "Please wait...";
                setTimeout(() => {
                    waitmsg.innerText = "This shouldn't take that long...";
                }, 2000);
            }, 2000);
        }, 2000);

        // Send the GET request
        fetch(`http://127.0.0.1:5000/sentiment?q=${query}`,{headers:{'Authorization': `Bearer ${localStorage.getItem('Token')}`}})
            .then(response => response.json())
            .then(data => {
                // Store the JSON response in localStorage
                localStorage.setItem("graph_data", JSON.stringify(data["data"]));
                localStorage.setItem("tweets", JSON.stringify(data["tweets"]));
                location.replace("dashboard")
                // Update the message
               
            })
            .catch(error => console.error("Error:", error));
    });
});
