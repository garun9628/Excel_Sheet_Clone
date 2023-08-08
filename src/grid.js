const rows = 100;
const cols = 26;

const addressColumnContainer = document.querySelector(".address-col-container");
const addressRowContainer = document.querySelector(".address-row-container");
const gridRowContainer = document.querySelector(".grid-cell-container");
const addressBar = document.querySelector(".address-bar");

// address column container contains cells from 1 to 100;
for (let i = 0; i < rows; i++) {
  const addressColCell = document.createElement("div");
  addressColCell.setAttribute("class", "address-col-cell");
  addressColCell.innerText = i + 1;
  addressColumnContainer.appendChild(addressColCell);
}

// address row container contains cells from A to Z;
for (let i = 0; i < cols; i++) {
  const addressRowCell = document.createElement("div");
  addressRowCell.setAttribute("class", "address-row-cell");
  addressRowCell.innerText = String.fromCharCode(65 + i);
  addressRowContainer.appendChild(addressRowCell);
}

// 2-D grid for values
for (let i = 0; i < rows; i++) {
  const rowContainer = document.createElement("div");
  rowContainer.setAttribute("class", "rowContainer");
  for (let j = 0; j < cols; j++) {
    const cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contenteditable", true);
    cell.setAttribute("spellcheck", false);

    // attributes for storage identification for a cell
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);

    rowContainer.appendChild(cell);
    displayValuesInAddressBar(cell, i, j);
  }
  gridRowContainer.appendChild(rowContainer);
}

function displayValuesInAddressBar(cell, i, j) {
  cell.addEventListener("click", (e) => {
    let rowId = i + 1;
    let colId = String.fromCharCode(65 + j);
    addressBar.value = `${colId}${rowId}`;
  });
}
