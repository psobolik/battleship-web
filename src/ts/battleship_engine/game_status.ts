import { Ship } from "./ship.js";
import { ShipStatus } from "./ship_status.js";

export class GameStatus {
  shots = 0;
  hits = 0;
  misses = 0;
  shipStatuses: ShipStatus[] = [];

  // This constructor allows us to create a pristine BattleshipEngine or one using data from a saved instance.
  constructor(ships: Ship[], data: GameStatus | undefined = undefined) {
    this.shipStatuses = ships.map(ship => new ShipStatus(ship.name, ship.char, ship.size));
    if (data) {
      this.shots = data.shots;
      this.hits = data.shots;
      this.misses = data.misses;
      this.shipStatuses.forEach((shipStatus) => {
        const dataShipStatus = data.shipStatuses.find(ss =>
          ss.char === shipStatus.char
        );
        if (dataShipStatus) shipStatus.hits = dataShipStatus.hits;
      });
    }
  }

  recordMiss = () => {
    ++this.shots;
    ++this.misses;
  };

  recordHit = (shipChar: string): ShipStatus | undefined => {
    ++this.shots;
    const shipHit = this.shipStatuses.find((ship) => ship.char === shipChar);
    if (shipHit) {
      ++this.hits;
      ++shipHit.hits;
      return shipHit;
    }
  };

  public sortShipStatuses = () => {
    this.shipStatuses.sort((a, b) =>
      a.size === b.size ? a.name.localeCompare(b.name) : a.size - b.size
    );
  }

  get anyAfloat(): boolean {
    return this.shipStatuses.some((ship) => ship.isAfloat);
  }
}
