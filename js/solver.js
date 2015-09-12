function GridSolver (gridWidth, dictionary, wordSizes) {
  this.gridWidth = gridWidth;
  this.dictionary = dictionary;
  this.wordSizes = wordSizes;
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

GridSolver.prototype.getChain = function (grid, possibleSizes, chain) {
  var result = [];
  // exit the recursion if we have already reached max
  var len = chain.length + 1;
  if (possibleSizes.every(function (size) { return len > size; })) {
    return [];
  }

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
        var nextSizes = [].concat(possibleSizes);
        if (isword === 2) {
          var indx = nextSizes.indexOf(len);
          if (indx !== -1) {
            result.push(possibility);
            nextSizes.splice(indx, 1);
          }
        }
        result = result.concat(this.getChain(grid, nextSizes, possibility));
      }
    }
  }
  return result;
}


GridSolver.prototype.findWordFromPoint = function (grid, x, y, possibleSizes) {
  if (grid[y][x] == "") {
    return [];
  }
  // generate a linked list of points that form a word
  return this.getChain(grid, possibleSizes, [{ x: x, y: y, v: grid[y][x] }]);
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

GridSolver.prototype.solve = function (grid) {
    // queue of items to test
    var options = [];
    
    var toTest = [{grid: grid, wordSizes: this.wordSizes, chains: [] }];
    while (toTest.length > 0) {
      var test = toTest.shift();

      for (var y = 0; y < this.gridWidth; y++) {
        for (var x = 0; x < this.gridWidth; x++) {

          var possiblities = this.findWordFromPoint(test.grid, x, y, test.wordSizes);

          for (var i = 0; i < possiblities.length; i++) {
            var chain = possiblities[i];
            var chains = test.chains.concat([chain]);

            // remove the word from the list of remaining sizes
            var remainingSizes = [].concat(test.wordSizes);
            var len = chain.length;
            remainingSizes.splice(remainingSizes.indexOf(len), 1);

            if (remainingSizes.length === 0) {
              return [chains];
            } else {
              var testGrid = this.cloneGrid(test.grid);

              for (var j = 0; j < chain.length; j++) {
                var item = chain[j];
                testGrid[item.y][item.x] = "";
              };

              var newGrid = this.applyGravity(testGrid);
              toTest.unshift({ grid: newGrid, wordSizes: remainingSizes, chains: chains });
            }
          }

        }
      }
    }

    return [];
}
