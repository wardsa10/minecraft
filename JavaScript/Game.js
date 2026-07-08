import World from "./World.js";
import Renderer from "./Renderer.js";
import Inventory from "./Inventory.js";
import Toolbar from "./Toolbar.js";
import Events from "./Events.js";

export default class Game {
  constructor(container) {
    this.container = container;

    //world
    this.world = new World(30, 20);

    // system
    this.inventory = new Inventory();
    this.toolbar = new Toolbar();

    // 🎨 العرض
    this.renderer = new Renderer(this.world, this.container);

    // 🎮 الأحداث
    this.events = new Events(
      this.world,
      this.renderer,
      this.inventory,
      this.toolbar,
    );

    this.init();
  }

  init() {
    this.world.load();
    this.inventory.load?.();

    this.renderer.render(); 

   
    this.events = new Events(
      this.world,
      this.renderer,
      this.inventory,
      this.toolbar,
    );
  }

  save() {
    this.world.save();
    this.inventory.save?.();
  }
}
