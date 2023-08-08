let ctrlKey;

document.addEventListener("keydown", (e) => {
  //   console.log(e);
  ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup", (e) => {
  //   console.log(e);
  ctrlKey = e.ctrlKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

const copyBtn = document.querySelector(".copy");
const cutBtn = document.querySelector(".cut");
const pasteBtn = document.querySelector(".paste");

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
    console.log(rangeStorage);
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

// COPY Functionality
let copyData = [];

copyBtn.addEventListener("click", (e) => {
  let strow = rangeStorage[0][0];
  let endrow = rangeStorage[1][0];
  let stcol = rangeStorage[0][1];
  let endcol = rangeStorage[1][1];

  for (let i = strow; i <= endrow; i++) {
    let copyRow = [];
    for (let j = stcol; j <= endcol; j++) {
      let cellProp = sheetDB[i][j];
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }
  defaultSelectedCellsUI();
});

// PASTE Functionality
pasteBtn.addEventListener("click", (e) => {
  let rowLen = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
  let colLen = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

  // target cell
  let address = addressBar.value;
  let [strow, stcol] = decodeIndexValuesFromAddress(address);

  // r refers copyData ki row
  // c refers copyData ki column
  for (let i = strow, r = 0; i <= strow + rowLen; i++, r++) {
    for (let j = stcol, c = 0; j <= stcol + colLen; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      console.log(cell);
      if (!cell) return;

      // update sheetDB
      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];
      //   console.log(data, cellProp);

      console.log(cellProp.val);
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

      // UI me change
      cell.click();
    }
  }
});
