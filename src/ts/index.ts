import { BattleshipEngine } from "./battleship_engine/battleship_engine.js";
import { Helpers } from "./battleship_engine/helpers.js";
import { ShipStatus } from "./battleship_engine/ship_status";

let g_battleshipEngine: BattleshipEngine;
const g_notifyElement = document.querySelector('#notify') as HTMLElement;
const g_winElement = document.querySelector('#win') as HTMLElement;
const g_fieldContainer = document.querySelector('#field-container') as HTMLElement;

// Hide the notification div when it's done animating
g_notifyElement.addEventListener('animationend', handleNotifyAnimationEnd);

// Hide the "you win" div and reset the game when it is clicked
g_winElement.addEventListener('click', event => { handleWinElementClick(event) });

// Respond to clicks in the field
g_fieldContainer.addEventListener('click', handleFieldClick);

window.addEventListener('load', () => {
  // Kick things off...
  reset();
})

function handleNotifyAnimationEnd() {
  g_notifyElement.classList.remove('notify-animate');
}

function handleWinElementClick(event: MouseEvent) {
  event.preventDefault();
  reset();
}

function reset() {
  g_battleshipEngine = new BattleshipEngine(10, 10);
  g_battleshipEngine.status.sortShipStatuses();
  setWinState(false);
  redraw();
}

function removeElementsByName(container: HTMLElement, name: string) {
  [...container.getElementsByClassName(name)].forEach(element => {
    container.removeChild(element);
  })
}

function handleShot(row: number, col: number) {
  if (g_notifyElement.classList.contains('notify-animate'))
    return; // Don't allow another shot until the notification is complete

  const shipStatus = g_battleshipEngine.takeShot(row, col);
  if (shipStatus) updateUi(shipStatus);
  redraw();
}

function setWinState(flag: boolean) {
  g_winElement.classList.toggle('win', flag);
  g_winElement.classList.toggle('no-win', !flag);
}

function updateUi(shipStatus: ShipStatus) {
  g_notifyElement.textContent = `${shipStatus.name.toUpperCase()} ${(shipStatus.isAfloat ? "HIT!" : "SUNK!")}`;
  g_notifyElement.classList.add('notify-animate');

  if (!g_battleshipEngine.status.anyAfloat) {
    setWinState(true);
  }
}

function handleFieldClick(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    if (target.type === 'button') {
      handleShot(Number(target.dataset.row), Number(target.dataset.col));
      console.log(target);
    }
}

function showField() {
  function createTarget(row: number, col: number): HTMLElement {
    // console.log(`${row},${col}: open`);
    const button = document.createElement('input') as HTMLInputElement;
    button.value = '⬜';
    button.style.gridColumn = (col + 1).toString();
    button.style.gridRow = (row + 1).toString();
    button.type = "button";
    button.classList.add("cell");
    button.dataset.row = row.toString();
    button.dataset.col = col.toString();
    return button;
  }

  function createHitOrMiss(char: string, row: number, col: number): HTMLElement {
    const element = document.createElement('span');
    element.textContent = char;
    element.style.gridColumn = (col + 1).toString();
    element.style.gridRow = (row + 1).toString();
    element.classList.add("cell");
    return element;
  }

  const missChar = '️✖';
  const hitChar = '💥';
  removeElementsByName(g_fieldContainer, 'cell');
  for (let row = 0; row < g_battleshipEngine.numRows; ++row) {
    for (let col = 0; col < g_battleshipEngine.numColumns; ++col) {
      const c = g_battleshipEngine.field[row][col];
      if (c === BattleshipEngine.openChar || (!Helpers.isUpperCase(c) && c !== BattleshipEngine.missChar)) {
        g_fieldContainer.appendChild(createTarget(row, col));
      } else {
        g_fieldContainer.appendChild(createHitOrMiss(Helpers.isUpperCase(c) ? hitChar : missChar, row, col));
      }
    }
  }
}

function showStatus() {
  function getStatusString(shipStatus: ShipStatus): string {
    const hitStatusChar: string = '🟥';
    const noHitStatusChar: string = '⬜';
    const result: string[] = [];
    let si = 0;
    while (si < shipStatus.hits) {
      result.push(hitStatusChar);
      ++si;
    }
    while (si < shipStatus.size) {
      result.push(noHitStatusChar);
      ++si;
    }
    return result.join('');
  }

  const container = document.getElementById('status-container') as HTMLElement;
  (document.getElementById('shots_fired') as HTMLElement).textContent = g_battleshipEngine.status.shots.toString();
  (document.getElementById('shots_hit') as HTMLElement).textContent = g_battleshipEngine.status.hits.toString();
  (document.getElementById('shots_missed') as HTMLElement).textContent = g_battleshipEngine.status.misses.toString();
  removeElementsByName(container, 'summary');

  let row = 5;
  g_battleshipEngine.status.shipStatuses.forEach(shipStatus => {
    const label = document.createElement('span');
    label.style.gridColumn = "1";
    label.style.gridRow = row.toString();
    label.classList.add('summary');
    if (!shipStatus.isAfloat)
      label.classList.add('sunk');
    label.textContent = shipStatus.name;
    container.appendChild(label);

    const panel = document.createElement('span');
    panel.style.gridColumn = "2";
    panel.style.gridRow = row.toString();
    panel.classList.add('summary');
    panel.textContent = getStatusString(shipStatus);
    container.appendChild(panel);

    ++row;
  })
}

function redraw() {
  showField();
  showStatus();
}
