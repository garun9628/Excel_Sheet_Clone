let ctrlKey;

document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

let rangeStorage = [];

function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    // handle edge cases
    if (!ctrlKey) return;
    if (rangeStorage.length >= 2) {
      defaultSelectedCellsUI();
      rangeStorage = [];
    }

    cell.style.border = "3px solid #218c73";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
  });
}

function defaultSelectedCellsUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid lightgrey";
  }
}

const copyBtn = document.querySelector(".copy");
const cutBtn = document.querySelector(".cut");
const pasteBtn = document.querySelector(".paste");

// COPY Functionality
let copyData = [];

copyBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;
  copyData = [];

  const [stRow, endRow, stCol, endCol] = [
    rangeStorage[0][0],
    rangeStorage[1][0],
    rangeStorage[0][1],
    rangeStorage[1][1],
  ];

  for (let i = stRow; i <= endRow; i++) {
    let copyRow = [];
    for (let j = stCol; j <= endCol; j++) {
      let cellProp = sheetDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }
  defaultSelectedCellsUI();
});

// CUT Functionality
cutBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;
  copyData = [];

  const [stRow, endRow, stCol, endCol] = [
    rangeStorage[0][0],
    rangeStorage[1][0],
    rangeStorage[0][1],
    rangeStorage[1][1],
  ];

  // first copy the data
  for (let i = stRow; i <= endRow; i++) {
    let copyRow = [];
    for (let j = stCol; j <= endCol; j++) {
      let cellProp = sheetDB[i][j];
      let clone = Object.assign({}, cellProp);
      copyRow.push(clone);
    }
    copyData.push(copyRow);
  }

  for (let i = stRow; i <= endRow; i++) {
    for (let j = stCol; j <= endCol; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      let cellProp = sheetDB[i][j];

      cellProp.val = "";
      cellProp.textColor = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = 14;
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.bgColor = "#000000";
      cellProp.alignment = "left";

      cell.click();
    }
  }
  defaultSelectedCellsUI();
});

// PASTE Functionality
pasteBtn.addEventListener("click", (e) => {
  console.log(copyData);
  if (rangeStorage.length < 2) return;

  let rowLen = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colLen = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  // target cell
  let address = addressBar.value;
  let [stRow, stCol] = decodeIndexValuesFromAddress(address);

  // r refers copyData ki row
  // c refers copyData ki column
  for (let i = stRow, r = 0; i <= stRow + rowLen; i++, r++) {
    for (let j = stCol, c = 0; j <= stCol + colLen; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue;

      // update sheetDB
      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];
      console.log(cellProp);

      cellProp.val = data.val;
      cellProp.textColor = data.textColor;
      cellProp.formula = data.formula;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.bgColor = data.bgColor;
      cellProp.alignment = data.alignment;

      // update UI. We already add "click" event listener to every cell in (cell-properties.js file) which is accessible in (cutCopyPaste.js), this "click" listener will set the values in UI.
      cell.click();
    }
  }
});
