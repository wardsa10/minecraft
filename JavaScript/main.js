import Game from "./Game.js";

const game = new Game(document.getElementById("world"));

document.addEventListener("keydown", (e) => {
  if (e.key === "s") {
    game.save();
    console.log("Game Saved!");
  }
});
console.log(document.getElementById("world"));