
const loginForm = document.getElementById("loginForm");

const username = document.getElementById("username");

loginForm.addEventListener("submit", (e) => {
     e.preventDefault(); 
  if (username === "") {
   alert("please filed username input to start play")
  }
     localStorage.setItem("username", username.value);
   window.location.href = "landing.html";

})