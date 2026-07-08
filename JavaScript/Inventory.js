export default class Inventory {
  constructor() {
    this.items = {
      grass: 0,
      sand: 0,
      snow: 0,
    };

    this.selected = null;
  }

  addItem(type, amount = 1) {
    if (!this.items[type]) this.items[type] = 0;

    this.items[type] += amount;
  }

  selectItem(type) {
    this.selected = type;
  }

  useItem(type) {
    if (this.items[type] > 0) {
      this.items[type]--;
    }
  }

  save() {
    localStorage.setItem("inventory", JSON.stringify(this.items));
  }

  load() {
    const data = localStorage.getItem("inventory");
    if (!data) return;

    this.items = JSON.parse(data);
  }
}
