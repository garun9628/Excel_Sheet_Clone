let graphMatrix = [];

for (let i = 0; i < rows; i++) {
  let row = [];
  for (let j = 0; j < cols; j++) {
    row.push([]);
  }
  graphMatrix.push(row);
}

function isGraphCyclic(graphMatrix) {
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

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j]) {
        let response = cycleDetection(graphMatrix, i, j, visited, dfsVisited);
        if (response) {
          return true;
        }
      }
    }
  }
  return false;
}

function cycleDetection(graphMatrix, srcr, srcc, visited, dfsVisited) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  for (
    let children = 0;
    children < graphMatrix[srcr][srcc].length;
    children++
  ) {
    let [nrid, ncid] = graphMatrix[srcr][srcc][children];

    if (!visited[nrid][ncid]) {
      let response = cycleDetection(
        graphMatrix,
        nrid,
        ncid,
        visited,
        dfsVisited
      );
      if (response) {
        return true;
      }
    } else if (visited[nrid][ncid] && dfsVisited[nrid][ncid]) {
      return true;
    }
  }
  dfsVisited[srcr][srcc] = false;
  return false;
}
