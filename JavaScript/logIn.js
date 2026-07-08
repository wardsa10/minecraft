const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const playername = document.getElementById("playerName");
startBtn.addEventListener("click", () => {
  let username = usernameInput.value;

  if (!username) {
    alert("Please enter your name");
    return;
  }

  localStorage.setItem("username", username);
 

  window.location.href = "game.html";
});
