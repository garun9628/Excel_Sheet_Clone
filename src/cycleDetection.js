let allGraphComponentMatrix = [];
let graphComponentMatrix = [];

function isGraphCyclic(graphComponentMatrix) {
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
        let response = cycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        if (response) {
          return [i, j];
        }
      }
    }
  }
  return null;
}

function cycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [nrid, ncid] = graphComponentMatrix[srcr][srcc][children];

    if (!visited[nrid][ncid]) {
      let response = cycleDetection(
        graphComponentMatrix,
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
