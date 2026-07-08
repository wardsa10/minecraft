export default class Events {
  constructor(world, renderer, inventory, toolbar) {
    this.world = world;
    this.renderer = renderer;
    this.inventory = inventory;
    this.toolbar = toolbar;

    this.init();
  }

  init() {
document.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell) return;

  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);

  const block = this.world.grid[y][x];
  if (!block) return;

  const tool = this.toolbar.selected;

  // Axe
  if (tool === "axe" && block.object === "tree") {
    this.inventory.addItem("tree", 1);
    block.object = null;
    this.renderer.render();
    return;
  }

  // Pickaxe
  if (tool === "pickaxe" && block.object === "rock") {
    this.inventory.addItem("rock", 1);
    block.object = null;
    this.renderer.render();
    return;
  }

  // Shovel
  if (tool === "shovel" && block.surface === "sand") {
    this.inventory.addItem("sand", 1);
    this.world.removeBlock(x, y);
    this.renderer.render();
  }
});
  }

  canBreak(tool, type) {
    const rules = {
      axe: "tree",
      pickaxe: "rock",
      shovel: "dirt",
    };

    return rules[tool] === type;
  }
}
