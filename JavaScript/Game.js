// ============================================================
// DATA — same values as before, just grouped at the top
// ============================================================

const BLOCKS = [
  { name: "Dirt", type: "dirt", image: "dirt.png" },
  { name: "Tree", type: "tree", image: "tree.png" },
  { name: "Rock", type: "rock", image: "rock.png" },
];

const TOOLS = [
  { name: "Axe", image: "axe.png", worksOn: "tree" },
  { name: "Pickaxe", image: "pickaxe.png", worksOn: "rock" },
  { name: "Shovel", image: "shovel.png", worksOn: "dirt" },
  { name: "Build", image: "build.png", worksOn: "build" },
];

const WORLD_MODES = [
  { name: "Grass", background: "grass.png", block: "grass" },
  { name: "Desert", background: "sand.png", block: "sand" },
  { name: "Snow", background: "snow.png", block: "snow" },
];

// ============================================================
// INVENTORY — holds the player's collected blocks
// ============================================================

class Inventory {
  constructor(container, blocks) {
    this.container = container;
    this.blocks = blocks;
    this.data = this.load() ?? { dirt: 0, tree: 0, rock: 0 };
    this.selectedBlock = null;
  }

  load() {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : null;
  }

  save() {
    localStorage.setItem("inventory", JSON.stringify(this.data));
  }

  has(type) {
    return this.data[type] > 0;
  }

  add(type) {
    this.data[type]++;
    this.save();
    this.render();
  }

  remove(type) {
    this.data[type]--;
    this.save();
    this.render();
  }

  reset() {
    this.data = { dirt: 0, tree: 0, rock: 0 };
    this.selectedBlock = null;
    this.save();
    this.render();
  }

  render() {
    this.container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Inventory:";
    title.className = "inventoryText";
    this.container.append(title);

    this.blocks.forEach((block) => {
      const item = document.createElement("button");
      item.className = "inventoryItem";
      item.innerHTML = `
        <img src="../assets/${block.image}">
        <p>${block.name}: ${this.data[block.type]}</p>
      `;

      item.addEventListener("click", () => {
        if (!this.has(block.type)) {
          console.log("No blocks available");
          return;
        }

        document.querySelectorAll(".inventoryItem").forEach((el) => {
          el.classList.remove("invetoryChoosed");
        });

        this.selectedBlock = block.type;
        localStorage.setItem("selectedBlock", block.type);
        item.classList.add("invetoryChoosed");
        console.log("Selected block:", block.type);
      });

      this.container.append(item);
    });
  }
}

// ============================================================
// TOOLBAR — axe / pickaxe / shovel / build selection
// ============================================================

class Toolbar {
  constructor(container, tools) {
    this.container = container;
    this.tools = tools;
    this.selectedTool = "not select";
    this.render();
  }

  render() {
    localStorage.setItem("selectedTool", this.selectedTool);

    this.tools.forEach((tool) => {
      const button = document.createElement("button");
      button.className = "toolButton";
      button.innerHTML = `
        <img src="../assets/${tool.image}">
        ${tool.name}
      `;

      button.addEventListener("click", () => {
        document.querySelectorAll(".toolButton").forEach((btn) => {
          btn.classList.remove("toolchossed");
        });

        button.classList.add("toolchossed");
        this.selectedTool = tool.worksOn;
        localStorage.setItem("selectedTool", tool.worksOn);
        console.log("Selected tool:", tool.name);
      });

      this.container.append(button);
    });
  }
}

// ============================================================
// GAME MODE — Grass / Desert / Snow background switch
// ============================================================

class GameModeManager {
  constructor(container, modes) {
    this.container = container;
    this.modes = modes;
    this.render();
    this.applyDefault();
  }

  render() {
    this.modes.forEach((mode) => {
      const button = document.createElement("button");
      button.textContent = mode.name;
      button.className = "modeButton";

      button.addEventListener("click", () => {
        document.querySelectorAll(".modeButton").forEach((btn) => {
          btn.classList.remove("active");
        });

        button.classList.add("active");
        document.body.style.backgroundImage = `url("../assets/${mode.background}")`;
        localStorage.setItem("worldMode", mode.name);
      });

      this.container.append(button);
    });
  }

  applyDefault() {
    const defaultMode = this.modes[0];
    document.body.style.backgroundImage = `url("../assets/${defaultMode.background}")`;
    document.querySelector(".modeButton").classList.add("active");
  }
}

// ============================================================
// WORLD — the grid of blocks the player can build on / break
// ============================================================

class World {
  constructor(container, blocks, width, height, inventory) {
    this.container = container;
    this.blocks = blocks;
    this.width = width;
    this.height = height;
    this.inventory = inventory;
    this.data = [];

    this.generate();
    this.render();
  }

  generate() {
    for (let y = 0; y < this.height; y++) {
      const row = [];

      for (let x = 0; x < this.width; x++) {
        const randomBlock =
          this.blocks[Math.floor(Math.random() * this.blocks.length)];
        row.push({
          x,
          y,
          name: randomBlock.name,
          type: randomBlock.type,
          image: randomBlock.image,
        });
      }

      this.data.push(row);
    }
  }

  render() {
    this.container.innerHTML = "";

    this.data.forEach((row) => {
      row.forEach((block) => {
        const cell = document.createElement("div");
        cell.className = "block";
        cell.dataset.type = block.type;
        cell.dataset.x = block.x;
        cell.dataset.y = block.y;
        cell.innerHTML = block.image
          ? `<img src="../assets/${block.image}">`
          : "";

        cell.addEventListener("click", () =>
          this.handleBlockClick(block, cell),
        );

        this.container.append(cell);
      });
    });
  }

  handleBlockClick(block, cell) {
    const selectedTool = localStorage.getItem("selectedTool");

    // BUILD
    if (selectedTool === "build") {
      const selectedBlockType = localStorage.getItem("selectedBlock");

      const canBuild =
        block.type === "empty" &&
        selectedBlockType &&
        this.inventory.has(selectedBlockType);

      if (canBuild) {
        const newBlock = this.blocks.find((b) => b.type === selectedBlockType);

        this.data[block.y][block.x] = {
          x: block.x,
          y: block.y,
          name: newBlock.name,
          type: newBlock.type,
          image: newBlock.image,
        };

        this.inventory.remove(selectedBlockType);

        cell.innerHTML = `<img src="../assets/${newBlock.image}">`;
        cell.dataset.type = newBlock.type;
      }
      return;
    }

    // BREAK
    if (selectedTool === block.type) {
      this.inventory.add(block.type);

      this.data[block.y][block.x] = {
        x: block.x,
        y: block.y,
        type: "empty",
        image: "",
      };

      this.render();
    } else {
      console.log("Cannot break", block.type, "with", selectedTool);
    }
  }
}

// ============================================================
// GAME — builds the page layout and connects every class
// ============================================================

class Game {
  constructor() {
    this.buildLayout();

    this.gameMode = new GameModeManager(this.header, WORLD_MODES);
    this.toolbar = new Toolbar(this.toolbarEl, TOOLS);
    this.inventory = new Inventory(this.inventoryEl, BLOCKS);
    this.world = new World(this.worldEl, BLOCKS, 15, 6, this.inventory);

    this.inventory.render();
    this.bindTopButtons();

    // fresh inventory every time the page loads (matches original behavior)
    this.inventory.reset();
  }

  buildLayout() {
    this.header = document.createElement("header");
    this.header.className = "header";

    const nameOfGamer = document.createElement("h1");
    nameOfGamer.id = "nameOfGamer";
    nameOfGamer.innerHTML = `Welcome, ${localStorage.getItem("username")} to Minecraft`;
    this.header.append(nameOfGamer);

    this.toolbarEl = document.createElement("section");
    this.toolbarEl.className = "toolbar";

    this.aside = document.createElement("section");
    this.aside.className = "aside";

    this.worldEl = document.createElement("section");
    this.worldEl.className = "world";

    this.inventoryEl = document.createElement("section");
    this.inventoryEl.className = "inventory";

    this.home = document.createElement("button");
    this.home.className = "home";
    this.home.innerHTML = `<img src="../assets/home.png">`;

    this.resetInventoryButton = document.createElement("button");
    this.resetInventoryButton.className = "resetInventoryButton";
    this.resetInventoryButton.innerHTML = `<img src="../assets/reset.png">`;

    this.aside.append(this.home, this.resetInventoryButton);

    document.body.append(
      this.header,
      this.toolbarEl,
      this.aside,
      this.worldEl,
      this.inventoryEl,
    );
  }

  bindTopButtons() {
    this.home.addEventListener("click", () => {
      this.inventory.reset();
      window.location.href = "../pages/login.html";
    });

    this.resetInventoryButton.addEventListener("click", () => {
      this.inventory.reset();
      console.log("Inventory reset");
    });
  }
}

// ============================================================
// START
// ============================================================

new Game();

async function lockLandscape() {
  try {
    await document.documentElement.requestFullscreen();
    await screen.orientation.lock("landscape");
  } catch (err) {
    console.log("Cannot lock orientation:", err);
  }
}