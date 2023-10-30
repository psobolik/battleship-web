export class Ship {
  name: string;
  char: string;
  size: number;

  constructor(name: string, char: string, size: number) {
    this.name = name;
    this.char = char;
    this.size = size;
  }

  public toString = (): string => {
    return JSON.stringify(this);
  };
}
