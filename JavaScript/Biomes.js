import Biome from "./Biome.js";

export const GrassBiome = new Biome("Grass", "grass", { tree: 0.3, rock: 0.1 });

export const DesertBiome = new Biome("Desert", "sand", {
  cactus: 0.2,
  rock: 0.15,
});

export const SnowBiome = new Biome("Snow", "snow", { tree: 0.1, rock: 0.2 });
