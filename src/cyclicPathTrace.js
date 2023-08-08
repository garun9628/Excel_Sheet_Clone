function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function cycleTracePath(graphComponentMatrix, cycleResponse) {
  let [srcr, srcc] = cycleResponse;
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  let response = await cycleDetectionTracePath(
    graphComponentMatrix,
    srcr,
    srcc,
    visited,
    dfsVisited
  );
  if (response) {
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
}

// coloring cell for tracing path
async function cycleDetectionTracePath(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);

  cell.style.backgroundColor = "lightblue";
  await colorPromise();
  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];

    if (!visited[nbrr][nbrc]) {
      let response = await cycleDetectionTracePath(
        graphComponentMatrix,
        nbrr,
        nbrc,
        visited,
        dfsVisited
      );
      if (response) {
        cell.style.backgroundColor = "transparent";
        await colorPromise();
        return Promise.resolve(true);
      }
    } else if (visited[nbrr][nbrc] && dfsVisited[nbrr][nbrc]) {
      let newCell = document.querySelector(
        `.cell[rid="${nbrr}"][cid="${nbrc}"]`
      );

      newCell.style.backgroundColor = "lightsalmon";
      await colorPromise();
      newCell.style.backgroundColor = "transparent";
      await colorPromise();
      cell.style.backgroundColor = "transparent";
      return Promise.resolve(true);
    }
  }
  dfsVisited[srcr][srcc] = false;
  return Promise.resolve(false);
}
