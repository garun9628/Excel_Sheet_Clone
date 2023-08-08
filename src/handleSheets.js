// console.log(allGraphComponentMatrix);
let activeSheetColor = "#ced6e0";

const sheetFolderContainer = document.querySelector(".sheet-folder-container");
const addSheetButton = document.querySelector(".sheet-icon-container");

addSheetButton.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");

  const allSheets = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheets.length);

  sheet.innerHTML = `<div class="sheet-content">Sheet ${
    allSheets.length + 1
  }</div>`;

  sheetFolderContainer.appendChild(sheet);
  createSheetDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);
  sheet.click();
});

function handleSheetDB(sheetIdx) {
  sheetDB = allSheetDB[sheetIdx];
  graphComponentMatrix = allGraphComponentMatrix[sheetIdx];
}

function handleSheetProperties() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.click();
    }
  }
  // By default click on first cell
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

function handleSheetUI(sheet) {
  const allSheets = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheets.length; i++) {
    allSheets[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleSheetProperties();
    handleSheetUI(sheet);
  });
}

function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return;

    const allSheets = document.querySelectorAll(".sheet-folder");
    if (allSheets.length == 1) {
      alert("You need to have atleast one sheet");
      return;
    }

    let response = confirm("Your sheet will be removed.\nAre you sure?");
    if (response === false) return;

    let sheetIdx = Number(sheet.getAttribute("id"));
    allSheetDB.splice(sheetIdx, 1);
    allGraphComponentMatrix.splice(sheetIdx, 1);

    // UI
    handleSheetUIRemoval(sheet);

    // After removing sheet. Bring Sheet 1 to active.
    sheetDB = allSheetDB[0];
    graphComponentMatrix = allGraphComponentMatrix[0];
    handleSheetProperties();
  });
}

function handleSheetUIRemoval(sheet) {
  sheet.remove();
  const allSheets = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheets.length; i++) {
    allSheets[i].setAttribute("id", i);
    let sheetContent = allSheets[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
    allSheets[i].style.backgroundColor = "transparent";
  }
  allSheets[0].style.backgroundColor = activeSheetColor;
}

function createSheetDB() {
  let sheetDB = [];

  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
      let cellProperties = {
        // default values
        bold: false,
        italic: false,
        underline: false,
        alignment: "left",
        fontFamily: "monospace",
        fontSize: "14",
        textColor: "#000000",
        bgColor: "#000000",
        val: "",
        formula: "",
        children: [],
      };
      sheetRow.push(cellProperties);
    }
    sheetDB.push(sheetRow);
  }
  allSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
  let graphComponentMatrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  allGraphComponentMatrix.push(graphComponentMatrix);
}
