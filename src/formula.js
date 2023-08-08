function handleBlur() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.addEventListener("blur", (e) => {
        let address = addressBar.value;
        let [activeCell, cellProp] = getCellAndCellProp(address);
        let enteredValue = activeCell.innerText;

        if (enteredValue === cellProp.val) return;

        cellProp.val = enteredValue;
        removeChildFromParent(cellProp.formula);
        cellProp.formula = "";
        updateChildren(address);

        // TODO: DOUBT: HARDCODE VALUES OF CELLS ARE NOT UPDATED PROPERLY

        // if (enteredValue !== cellProp.val) {
        // cellProp.val = enteredValue;
        // removeChildFromParent(cellProp.formula);
        // cellProp.formula = "";
        // updateChildren(address);
        //   return;
        // }
        // cellProp.val = enteredValue;
      });
    }
  }
}
handleBlur();

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", async (e) => {
  let inputFormula = formulaBar.value;
  if (e.key === "Enter" && inputFormula) {
    let evaluatedValue = evaluateFormula(inputFormula);

    // check if current formula is already there in sheetDB, if not then delete the old link between parent and child.
    let address = addressBar.value;
    const [cell, cellProp] = getCellAndCellProp(address);
    if (inputFormula !== cellProp.formula) {
      removeChildFromParent(cellProp.formula);
    }

    addChildToGraphComponent(inputFormula, address);

    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if (cycleResponse) {
      let response = confirm(
        "Your formula is cyclic. \n Do you want to Trace Path"
      );
      if (response) {
        while (response) {
          await cycleTracePath(graphComponentMatrix, cycleResponse);
          response = confirm(
            "Your formula is cyclic.\nDo you want to Trace Path"
          );
        }
      }
      removeChildFromGraphComponent(inputFormula, address);
      return;
    }

    // update UI and cellProp in sheetDB
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    addChildToParent(inputFormula);
    updateChildren(address);
  }
});

function addChildToGraphComponent(formula, childAddress) {
  const [crid, ccid] = decodeIndexValuesFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeIndexValuesFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(formula, childAddress) {
  const [crid, ccid] = decodeIndexValuesFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeIndexValuesFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function addChildToParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}
function removeChildFromParent(formula) {
  let childAddress = addressBar.value;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function updateChildren(parentAddress) {
  let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getCellAndCellProp(childAddress);
    let childFormula = childCellProp.formula;
    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChildren(childAddress);
  }
}

function evaluateFormula(formula) {
  if (formula === "") return;
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
      encodedFormula[i] = cellProp.val;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula);
}

function setCellUIAndCellProp(value, formula, address) {
  let [cell, cellProp] = getCellAndCellProp(address);

  cell.innerText = value;
  cellProp.val = value;
  cellProp.formula = formula;
}
