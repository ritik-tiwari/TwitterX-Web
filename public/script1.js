const otpbtn = document.querySelector('.otp-btn');
otpbtn.addEventListener('click', () => {
    // Get the values from the input fields
    const mail = document.querySelector('.signup input[placeholder="Email"]').value;
    mail.disabled=true
    if (mail.includes(".") && mail.includes("@")){
        otpbtn.style.backgroundColor='grey';
        otpbtn.setAttribute('disabled', 'true');


    // Create an object with the user's data
    fetch(`http://localhost:3000/send-otp?mail=${mail}`)
  .then(response => response.json())
  .then(data => {
    if (data.message === 'User not found' && !document.getElementsByClassName("tex")[1]) {
      const div = document.createElement('p');
      div.className = 'tex';
      div.id='rmsg '
      div.textContent = 'User not found';
      document.querySelector('#sp1').appendChild(div);
      setTimeout(() => {
        window.location.reload();
      }, 1500); // 5000 milliseconds = 5 seconds
    } else if (data.message === 'OTP sent successfully') {
      mail.disabled=true
      const hed=document.getElementsByClassName("tex")[0].textContent="Enter the OTP and create your new password"
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter OTP';
      input.id='inotp'
      document.querySelector('#sp1').appendChild(input);
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.placeholder = 'Enter new password';
      input1.id='passwd'
      document.querySelector('#sp1').appendChild(input1);
      mail.disabled=true
      const otpBtn = document.querySelector('.otp-btn');
      otpBtn.parentNode.removeChild(otpBtn);

      const button = document.createElement('button');
      button.textContent = 'Change Password';
      button.addEventListener('click', changepwd);
      document.querySelector('#sp1').appendChild(button);
      document.querySelector('.form-section-signup').appendChild(button);
    }
  })
  .catch(error => console.error('Error:', error));
}
    // Clear the input fields after signup
    //document.querySelector('.signup input[placeholder="Password"]').value = '';
    otpbtn.style.backgroundColor='grey';
});

function changepwd(){
    var email=document.getElementById("mail").value
    var passwd=document.getElementById("passwd").value
    var otp=document.getElementById("inotp").value
    payload={
        "email":email,
        "password":passwd,
        "otp":otp
    }
    fetch('http://localhost:3000/set-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
.then(response => response.json())
.then(data => {
  if (data.message === 'Password updated successfully') {
    alert("Password Changed Successfully")
    window.location.replace('..'); // Redirect to the desired location
  } else {
    alert(data.message); // Show the message from the response
  }
})
.catch(error => {
  console.error('Error:', error);
  alert('An error occurred while processing your request');
});
}