export default class Toolbar {
  constructor() {
    this.tools = ["axe", "pickaxe", "shovel"];
    this.selected = "axe";

    this.container = document.createElement("section");
    this.container.className = "toolbar";
    document.body.appendChild(this.container);

    this.render();
  }

  select(tool) {
    this.selected = tool;
    this.render();
  }

  render() {
    this.container.innerHTML = "";

    this.tools.forEach((tool) => {
      const btn = document.createElement("button");
      btn.textContent = tool;

      if (tool === this.selected) {
        btn.classList.add("active");
      }

      btn.onclick = () => this.select(tool);

      this.container.appendChild(btn);
    });
  }
}
