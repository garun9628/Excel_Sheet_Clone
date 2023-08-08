let allSheetDB = [];
let sheetDB = [];

{
  const addSheetButton = document.querySelector(".sheet-icon-container");
  addSheetButton.click();
}

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let textColor = document.querySelector(".text-color-prop");
let bgColor = document.querySelector(".bgColor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlignment = alignment[0];
let centerAlignment = alignment[1];
let rightAlignment = alignment[2];

//  Listeners for cell properties
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  // Modification on a cell
  cellProp.bold = !cellProp.bold;
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp;
});

italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  // Modification on a cell
  cellProp.italic = !cellProp.italic;
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
  italic.style.backgroundColor = cellProp.italic
    ? activeColorProp
    : inactiveColorProp;
});

underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  // Modification on a cell
  cellProp.underline = !cellProp.underline;
  cell.style.textDecoration = cellProp.underline ? "underline" : "none";
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp;
});

fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontSize = fontSize.value;
  cell.style.fontSize = fontSize.value + "px";
  fontSize.value = cellProp.fontSize;
});
fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.fontFamily = fontFamily.value;
  cell.style.fontFamily = fontFamily.value;
  fontFamily.value = cellProp.fontFamily;
});
textColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.textColor = textColor.value;
  cell.style.color = textColor.value;
  textColor.value = cellProp.textColor;
});
bgColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = getCellAndCellProp(address);

  cellProp.bgColor = bgColor.value;
  cell.style.backgroundColor = bgColor.value;
  bgColor.value = cellProp.bgColor;
});

alignment.forEach((alignEle) => {
  alignEle.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    // console.log(e.target);
    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue;
    cell.style.textAlign = alignValue;

    switch (alignValue) {
      case "left":
        leftAlignment.style.backgroundColor = activeColorProp;
        centerAlignment.style.backgroundColor = inactiveColorProp;
        rightAlignment.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlignment.style.backgroundColor = inactiveColorProp;
        centerAlignment.style.backgroundColor = activeColorProp;
        rightAlignment.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlignment.style.backgroundColor = inactiveColorProp;
        centerAlignment.style.backgroundColor = inactiveColorProp;
        rightAlignment.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  listenerToAttachCellProp(allCells[i]);
}

function listenerToAttachCellProp(cell) {
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rid, cid] = decodeIndexValuesFromAddress(address);
    let cellProp = sheetDB[rid][cid];

    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.textColor;
    cell.style.backgroundColor =
      cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
    cell.style.textAlign = cellProp.alignment;

    bold.style.backgroundColor = cellProp.bold
      ? activeColorProp
      : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    textColor.value = cellProp.textColor;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    bgColor.value = cellProp.bgColor;
    switch (cellProp.alignment) {
      case "left":
        leftAlignment.style.backgroundColor = activeColorProp;
        centerAlignment.style.backgroundColor = inactiveColorProp;
        rightAlignment.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlignment.style.backgroundColor = inactiveColorProp;
        centerAlignment.style.backgroundColor = activeColorProp;
        rightAlignment.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlignment.style.backgroundColor = inactiveColorProp;
        centerAlignment.style.backgroundColor = inactiveColorProp;
        rightAlignment.style.backgroundColor = activeColorProp;
        break;
    }

    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.val;
  });
}

function getCellAndCellProp(address) {
  let [rid, cid] = decodeIndexValuesFromAddress(address);
  // access cell and storage value (sheetDB)
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeIndexValuesFromAddress(address) {
  // address => B16
  let rid = Number(address.slice(1)) - 1;
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}
