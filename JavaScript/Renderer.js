export default class Renderer {
  constructor(world, container) {
    this.world = world;
    this.container = container;
  }

  render() {
    this.container.innerHTML = "";

    for (let y = 0; y < this.world.height; y++) {
      const row = document.createElement("div");
      row.className = "row";

      for (let x = 0; x < this.world.width; x++) {
        const block = this.world.grid[y][x];

        const cell = document.createElement("div");
        cell.className = "cell";

        //  ALWAYS set coordinates
        cell.dataset.x = x;
        cell.dataset.y = y;

        // empty block
        if (!block) {
          const tile = document.createElement("div");
          tile.className = "tile empty";
          cell.appendChild(tile);
          row.appendChild(cell);
          continue;
        }

        //  base texture (ground)
        const tile = document.createElement("div");
        tile.className = "tile";

        let texturePath = "";

        // choose base texture
        switch (block.surface) {
          case "grass":
            texturePath = "grass.png";
            break;

          case "dirt":
            texturePath = "dirt.png";
            break;

          case "rock":
            texturePath = "rock.png";
            break;

          default:
            texturePath = "grass.png";
        }

        tile.style.backgroundImage = `url(../assets/${texturePath})`;

        //  object layer
        if (block.object === "tree") {
          const object = document.createElement("div");
          object.className = "tile object";
          object.style.backgroundImage = `url(../assets/tree.png)`;

          cell.appendChild(tile);
          cell.appendChild(object);
        } else {
          cell.appendChild(tile);
        }

        row.appendChild(cell);
      }

      this.container.appendChild(row);
    }
  }
}
