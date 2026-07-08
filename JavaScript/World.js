import { GrassBiome, DesertBiome, SnowBiome } from "./Biomes.js";

export default class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.grid = [];
    this.biomes = [GrassBiome, DesertBiome, SnowBiome];

    this.generateWorld();
  }

  generateWorld() {
    const regionSize = 6;

    for (let y = 0; y < this.height; y++) {
      const row = [];

      for (let x = 0; x < this.width; x++) {
        const biome = this.getBiome(x, y, regionSize);

        row.push({
          biome: biome.name,
          surface: biome.surface, 
          object: null,
        });
      }

      this.grid.push(row);
    }
this.addRocks();
    this.addTrees();
  }

  getBiome(x, y, size) {
    const rx = Math.floor(x / size);
    const ry = Math.floor(y / size);

    const seed = (rx * 13 + ry * 17) % 100;

    if (seed < 50) return this.biomes[0];
    if (seed < 80) return this.biomes[1];
    return this.biomes[2];
  }

  addRocks() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const block = this.grid[y][x];

        if (!block) continue;

        if (Math.random() < 0.05) {
          block.object = "rock";
        }
      }
    }
  }

  addTrees() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const block = this.grid[y][x];

        if (!block) continue;

        if (block.surface === "grass" && Math.random() < 0.07) {
          block.object = "tree";
        }
      }
    }
  }

  removeBlock(x, y) {
    const block = this.grid[y][x];
    this.grid[y][x] = null;
    return block;
  }

  placeBlock(x, y, type) {
    if (!this.grid[y][x]) {
      this.grid[y][x] = {
        biome: type,
        surface: type, 
        object: null,
      };
    }
  }

  save() {
    localStorage.setItem(
      "world",
      JSON.stringify({
        width: this.width,
        height: this.height,
        grid: this.grid,
      }),
    );
  }

  load() {
    const data = localStorage.getItem("world");
    if (!data) return;

    const parsed = JSON.parse(data);

    this.width = parsed.width;
    this.height = parsed.height;
    this.grid = parsed.grid;
  }
}
