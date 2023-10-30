import { Ship } from "./ship.js";

export class ShipStatus extends Ship {
  hits = 0;

  constructor(name: string, char: string, size: number) {
    super(name, char, size);
  }

  get isAfloat(): boolean {
    return this.hits < this.size;
  }
}
