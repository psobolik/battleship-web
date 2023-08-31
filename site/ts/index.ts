import {BattleshipEngine} from "./battleship_engine/battleship_engine.js";
import {Helpers} from "./battleship_engine/helpers.js";
import {ShipStatus} from "./battleship_engine/ship_status";

let g_battleshipEngine: BattleshipEngine;

// Hide the notification div when it's done animating
(document.getElementById('notify') as HTMLElement)
  .addEventListener('animationend', _evt => {
    ((document.getElementById('notify') as HTMLElement))
      .classList.remove('notify-animate');
  });

// Hide the "you win" div and reset the game when it is clicked
(document.getElementById('win') as HTMLElement)
  .addEventListener('click', _evt => {
    (document.getElementById('win') as HTMLElement)
      .style.display = 'none';
    reset();
  })

window.addEventListener('load', () => {
  // Kick things off...
  reset();
})

function reset() {
  g_battleshipEngine = new BattleshipEngine(10, 10);
  g_battleshipEngine.status.shipStatuses.sort((a, b) =>
    a.size === b.size ? a.name.localeCompare(b.name) : a.size - b.size
  );
  redraw();
}

function removeElementsByName(container: HTMLElement, name: string) {
  // let elements = container.getElementsByClassName(name) as HTMLCollectionOf<HTMLElement>;
  for (const element of Array.from(container.getElementsByClassName(name) as HTMLCollectionOf<HTMLElement>)) {
    container.removeChild(element);
  }
}

function handleShot(row: number, col: number) {
  const notify = document.getElementById('notify') as HTMLElement;
  if (notify.classList.contains('notify-animate'))
    return; // Don't allow another shot until the notification is complete

  const shipStatus = g_battleshipEngine.takeShot(row, col);
  if (shipStatus) {
    notify.textContent = `${shipStatus.name.toUpperCase()} ${(shipStatus.isAfloat ? "HIT!" : "SUNK!")}`;
    notify.classList.add('notify-animate');

    if (!g_battleshipEngine.status.anyAfloat) {
      const win = document.getElementById('win') as HTMLElement;
      win.style.display = 'block';
    }
  }
  redraw();
}

function showField() {
  function showTarget(row: number, col: number, container: HTMLElement) {
    // console.log(`${row},${col}: open`);
    const button = document.createElement('input') as HTMLInputElement;
    button.value = '⬜';
    button.style.gridColumn = (col + 1).toString();
    button.style.gridRow = (row + 1).toString();
    button.type = "button";
    button.classList.add("cell");
    button.dataset.row = row.toString();
    button.dataset.col = col.toString();
    button.addEventListener('click', ev => {
      const target = ev.target as HTMLInputElement;
      handleShot(Number(target.dataset.row), Number(target.dataset.col));
    })
    container.appendChild(button);
  }

  function showHitOrMiss(char: string, row: number, col: number, container: HTMLElement) {
    const element = document.createElement('span');
    element.textContent = char;
    element.style.gridColumn = (col + 1).toString();
    element.style.gridRow = (row + 1).toString();
    element.classList.add("cell");
    container.appendChild(element);
  }

  const missChar = '️✖';
  const hitChar = '💥';
  const container = document.getElementById('field-container') as HTMLElement;
  removeElementsByName(container, 'cell');
  for (let row = 0; row < g_battleshipEngine.numRows; ++row) {
    for (let col = 0; col < g_battleshipEngine.numColumns; ++col) {
      const c = g_battleshipEngine.field[row][col];
      if (c === BattleshipEngine.openChar || !Helpers.isUpperCase(c)) {
        showTarget(row, col, container);
      } else {
        showHitOrMiss(Helpers.isUpperCase(c) ? hitChar : missChar, row, col, container);
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
