export default class Biome {
  constructor(name, surface, resources = {}) {
    this.name = name;
    this.surface = surface;
    this.resources = resources; 
  }
}
