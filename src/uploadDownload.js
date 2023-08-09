let download = document.querySelector(".download");
let upload = document.querySelector(".upload");

download.addEventListener("click", (e) => {
  let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
  let file = new Blob([jsonData], { type: "application/json" });

  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "SheetData.json";
  a.click();
});

upload.addEventListener("click", (e) => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", () => {
    let fr = new FileReader();
    let files = input.files;
    let fileObject = files[0];

    fr.readAsText(fileObject);
    fr.addEventListener("load", (e) => {
      let readSheetData = JSON.parse(fr.result);

      // Default sheet will be created. Already eventListener is attached to addSheetButton in handleSheet.js
      addSheetButton.click();

      // Read sheetDB, graphComponentMatrix and overwrite the values in a sheet.
      sheetDB = readSheetData[0];
      graphComponentMatrix = readSheetData[1];
      allSheetDB[allSheetDB.length - 1] = sheetDB;
      allGraphComponentMatrix[allGraphComponentMatrix.length - 1] =
        graphComponentMatrix;
      handleSheetProperties();
    });
  });
});
