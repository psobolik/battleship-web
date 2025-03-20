import { Helpers } from "./helpers.js";
import { Position } from "./position.js";
import { Ship } from "./ship.js";
import { GameStatus } from "./game_status.js";
import { ShipStatus } from "./ship_status.js";

enum Direction {
  HORIZONTAL,
  VERTICAL,
}

export class InvalidArgumentError extends Error {
  constructor() {
    super("Invalid Arguments");
    this.name = "InvalidArgumentError";
    this.stack = new Error().stack;
  }
}

export class BattleshipEngine {
  public static readonly minDimension = 10;
  public static readonly maxDimension = 26;
  public static readonly defaultDimension = 10;

  public static readonly openChar = "·";
  public static readonly missChar = "*";

  public static readonly Carrier = new Ship("Carrier", "c", 5);
  public static readonly Battleship = new Ship("Battleship", "b", 4);
  public static readonly Cruiser = new Ship("Cruiser", "r", 3);
  public static readonly Submarine = new Ship("Submarine", "s", 3);
  public static readonly Destroyer = new Ship("Destroyer", "d", 2);

  static readonly ships: Ship[] = [
    BattleshipEngine.Carrier,
    BattleshipEngine.Battleship,
    BattleshipEngine.Cruiser,
    BattleshipEngine.Submarine,
    BattleshipEngine.Destroyer
  ];

  private gameStatus: GameStatus = new GameStatus(BattleshipEngine.ships);
  private grid: string[][] = [];

  get field(): string[][] {
    return this.grid;
  }

  private set field(value: string[][]) {
    this.grid = value;
  }

  get status(): GameStatus {
    return this.gameStatus;
  }

  private set status(value: GameStatus) {
    this.gameStatus = value;
  }

  get numColumns() {
    return this.grid.length > 0 ? this.grid[0].length : 0;
  }

  get numRows() {
    return this.grid.length;
  }

  // This constructor allows us to create a unique BattleshipEngine or one using data from a saved instance.
  constructor(
    colCount = BattleshipEngine.defaultDimension,
    rowCount: number | undefined = undefined,
    data: BattleshipEngine | undefined = undefined,
  ) {
    if (data) {
      this.status = new GameStatus(BattleshipEngine.ships, data.gameStatus);
      this.field = data.grid;
    } else {
      this.init(colCount, rowCount);
    }
  }

  private init(
    colCount = BattleshipEngine.defaultDimension,
    rowCount: number | undefined = undefined,
  ) {
    // If row count is not specified, use column count
    rowCount ??= colCount;

    // Sanity checks
    if (
      rowCount > BattleshipEngine.maxDimension ||
      rowCount < BattleshipEngine.minDimension ||
      colCount > BattleshipEngine.maxDimension ||
      colCount < BattleshipEngine.minDimension
    ) {
      throw new InvalidArgumentError();
    }

      const shipWillFit = (
          start: Position,
          direction: Direction,
          ship: Ship,
      ): boolean => {
          if (direction === Direction.HORIZONTAL) {
              var colLimit = start.col + ship.size;
              for (let col = start.col; col < colLimit; ++col) {
                  if (!this.isCellFree(new Position(start.row, col))) {
                      return false;
                  }
              }
          } else { // (direction === Direction.VERTICAL)
              var rowLimit = start.row + ship.size;
              for (let row = start.row; row < rowLimit; ++row) {
                  if (!this.isCellFree(new Position(row, start.col))) {
                      return false;
                  }
              }
          }
          return true;
      };
      const placeShip = (start: Position, direction: Direction, ship: Ship) => {
          if (direction === Direction.HORIZONTAL) {
              let colLimit = start.col + ship.size;
              for (let col = start.col; col < colLimit; ++col) {
                  this.setCharAt(new Position(start.row, col), ship.char);
              }
          } else { // (direction === Direction.VERTICAL)
              let rowLimit = start.row + ship.size;
              for (let row = start.row; row < rowLimit; ++row) {
                  this.setCharAt(new Position(row, start.col), ship.char);
              }
          }
      };

    this.status = new GameStatus(BattleshipEngine.ships);

    // Create empty grid
    this.field = [];
    for (let row = 0; row < rowCount; ++row) {
      this.field[row] = [];
      for (let col = 0; col < colCount; ++col) {
        this.field[row].push(BattleshipEngine.openChar);
      }
    }

    // Place ships
    BattleshipEngine.ships
      .sort((l, r) => l.size - r.size)
      .forEach((ship) => {
        let start: Position;
        let direction: Direction;
        do {
          start = new Position(
            Helpers.randomInt(0, rowCount ?? colCount),
            Helpers.randomInt(0, colCount),
          );
          direction = Helpers.randomInt(0, 2) as Direction;
        } while (!shipWillFit(start, direction, ship));
        placeShip(start, direction, ship);
      });
  }

  private isCellFree(position: Position): boolean {
    return this.getCharAt(position) == BattleshipEngine.openChar;
  }

  private getCharAt(position: Position): string {
    return this.numRows > position.row && this.numColumns > position.col
      ? this.grid[position.row][position.col]
      : "\0";
  }

  private setCharAt(position: Position, char: string) {
    this.grid[position.row][position.col] = char;
  }

  public takeShot(row: number, col: number): ShipStatus | undefined {
    const position = new Position(row, col);
    const charAtPosition = this.getCharAt(position);
    const shipAtPosition = BattleshipEngine.ships.find((ship) =>
      ship.char === charAtPosition
    );
    if (shipAtPosition) {
      this.setCharAt(position, shipAtPosition.char.toUpperCase());
      return this.gameStatus.recordHit(shipAtPosition.char);
    } else {
      if (charAtPosition === BattleshipEngine.openChar) {
        this.setCharAt(position, BattleshipEngine.missChar);
      }
      this.gameStatus.recordMiss();
    }
  }

  public cheat() {
      for (var row = 0; row < this.numRows; ++row) {
          for (var col = 0; col < this.numColumns; ++col) {
              this.grid[row][col] = this.grid[row][col].toUpperCase();
          }
      }
  }
}
