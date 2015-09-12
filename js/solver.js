function GridSolver (gridWidth, dictionary) {
  this.gridWidth = gridWidth;
  this.dictionary = dictionary;
}

  // returns: 
  //  0 = no match
  //  1 = possible word
  //  2 = word
GridSolver.prototype.wordCheck = function (letters) {
  var set = this.dictionary;
  for (var i = 0; i < letters.length && set !== undefined; i++) {
    set = set[letters[i]];
  };
  if (set === undefined) {
    return 0;
  }
  if (set["&"] === 1) {
    return 2;
  }
  return 1;
}

GridSolver.prototype.possibleChain = function(chain) {
  var letters = chain.map (function (item) { return item.v; });
  return this.wordCheck(letters);
}


GridSolver.prototype.isItemMatch = function (x, y, item) {
  return item.x === x && item.y === y;
}

GridSolver.prototype.getChain = function (grid, chain) {
  var result = [];
  var last = chain[chain.length - 1];
  var minX = Math.max(last.x - 1, 0);
  var maxX = Math.min(last.x + 2, this.gridWidth);
  var minY = Math.max(last.y - 1, 0);
  var maxY = Math.min(last.y + 2, this.gridWidth);
  for (var y = minY; y < maxY; y++) {
    for (var x = minX; x < maxX; x++) {
      if (grid[y][x] === "" || chain.some(this.isItemMatch.bind(this, x, y))) {
        continue;
      }
      var possibility = chain.concat([{ x: x, y: y, v: grid[y][x] }]);
      var isword = this.possibleChain(possibility);
      if (isword) {
        if (isword === 2) {
          result.push(possibility);
        }
        result = result.concat(this.getChain(grid, possibility));
      }
    }
  }
  return result;
}


GridSolver.prototype.findWordFromPoint = function (grid, x, y) {
  if (grid[y][x] == "") {
    return [];
  }
  // generate a linked list of points that form a word
  return this.getChain(grid, [{ x: x, y: y, v: grid[y][x] }]);
}

GridSolver.prototype.cloneGrid = function (grid) {
  var clone = [];
  for (var y = 0; y < this.gridWidth; y++) {
    clone.push([]);
    for (var x = 0; x < this.gridWidth; x++) {
      clone[y][x] = grid[y][x];
    }
  }
  return clone;
}

GridSolver.prototype.applyGravity = function (grid) {
  var result = this.cloneGrid(grid);
  for (var y = this.gridWidth - 1; y >= 0; y--) {
    for (var x = 0; x < this.gridWidth; x++) {
      if (result[y][x] === "") {
        // empty cell, so find the first value 
        // above it and bring it down
        for(var y2 = y - 1; y2>=0; y2--) {
          if (result[y2][x] !== "") {
            result[y][x] = result[y2][x];
            result[y2][x] = "";
            break;
          }
        }
      }
    }
  }
  return result;
}

GridSolver.prototype.isEmptyGrid = function (grid) {
  var empty = true;
  for (var y = 0; y < this.gridWidth && empty; y++) {
    for (var x = 0; x < this.gridWidth && empty; x++) {
      if(grid[y][x] !== "") {
        empty = false;
      }
    }
  }
  return empty;
}


GridSolver.prototype.solve = function (grid) {
    var options = [];
    // queue of items to test
    var toTest = [{grid: grid, chains: [] }];
    while (toTest.length > 0) {
      var test = toTest.shift();

      for (var y = 0; y < this.gridWidth; y++) {
        for (var x = 0; x < this.gridWidth; x++) {

          var possiblities = this.findWordFromPoint(test.grid, x, y);

          for (var i = 0; i < possiblities.length; i++) {
            var chain = possiblities[i];
            var chains = test.chains.concat([chain]);
            var testGrid = this.cloneGrid(test.grid);
            for (var j = 0; j < chain.length; j++) {
              var item = chain[j];
              testGrid[item.y][item.x] = "";
            };
            if (this.isEmptyGrid(testGrid)) {
              options.push(chains);
            }
            toTest.push({ grid: this.applyGravity(testGrid), chains: chains });
          }

        }
      }
    }
    return options;
}
