export class Position {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  public toString = (): string => {
    return JSON.stringify(this);
  };
}
