function app() {

  var errorDiv =  document.getElementById("errors");
  var gridDiv = document.getElementById("grid");
  var resultDiv = document.getElementById("results");
  var dictionary = {};
  var gridWidth = 2;

  function writeError(str) {
    errorDiv.innerHTML = "<h4>" + str + "</h4>";
  }

  function loadDictionary (next) {
    var request = new XMLHttpRequest();
    request.open('GET', 'out.json', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        dictionary = JSON.parse(request.responseText);
        next();
      } else {
        writeError("Failed to load dictionary");
      }
    };
    request.onerror = function() {
      writeError("Failed to load dictionary");
    };
    request.send();
  }

  // returns: 
  //  0 = no match
  //  1 = possible word
  //  2 = word
  function wordCheck (letters) {
    var set = dictionary;
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

  function drawGrid () {
    gridWidth = parseInt(document.getElementsByName("gridwidth")[0].value, 10);
    var html = [];
    for (var y = 0; y < gridWidth; y++) {
      html.push('<div class="grid-row">');
      for (var x = 0; x < gridWidth; x++) {
        html.push('<input type="text" name="gridelement" size="1" maxlength="1" pattern="[a-zA-Z]" data-x="' + x + '" data-y="' + y + '" />');
      }
      html.push('</div>');
    };
    gridDiv.innerHTML = html.join("");
  }

  function possibleChain(chain) {
    var letters = chain.map (function (item) { return item.v; });
    return wordCheck(letters);
  }

  function isItemMatch(x, y, item) {
    return item.x === x && item.y === y;
  }

  function getChain (grid, chain) {
    var result = [];
    var last = chain[chain.length - 1];
    var minX = Math.max(last.x - 1, 0);
    var maxX = Math.min(last.x + 2, gridWidth);
    var minY = Math.max(last.y - 1, 0);
    var maxY = Math.min(last.y + 2, gridWidth);
    for (var y = minY; y < maxY; y++) {
      for (var x = minX; x < maxX; x++) {
        if (grid[y][x] === "" || chain.some(isItemMatch.bind(null, x, y))) {
          continue;
        }
        var possibility = chain.concat([{ x: x, y: y, v: grid[y][x] }]);
        var isword = possibleChain(possibility);
        if (isword) {
          if (isword === 2) {
            result.push(possibility);
          }
          result = result.concat(getChain(grid, possibility));
        }
      }
    }
    return result;
  }

  function findWordFromPoint(grid, x, y) {
    if (grid[y][x] == "") {
      return;
    }
    // first generate a linked list of points
    var possibilities = getChain(grid, [{ x: x, y: y, v: grid[y][x] }]);
    var html = ["<div><h3>From position: ", x, ",", y, "</h3></div>"];
    possibilities.forEach(function (p) {
      var w = p.reduce(function (word, item) { return word + item.v; }, "");
      html.push("<div>" + w + "</div>");
    });

    resultDiv.innerHTML = resultDiv.innerHTML + html.join("");
    /*
    {
      [{ x, y, v }, {x, y, v}]
    } 
    */
  }

  function findWords (grid) {
    resultDiv.innerHTML = "";
    for (var y = 0; y < gridWidth; y++) {
      for (var x = 0; x < gridWidth; x++) {
        findWordFromPoint(grid, x, y);
      }
    }
  }

  function solve () {
    var elements = document.getElementsByName("gridelement");
    var grid = [];
    for (var y = 0; y < gridWidth; y++) {
      grid.push([]);
      for (var x = 0; x < gridWidth; x++) {
        grid[y].push("");
      }
    }
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var x = element.getAttribute("data-x");
      var y = element.getAttribute("data-y");
      grid[y][x] = element.value.replace(" ", "");
    }
    for (var y = 0; y < gridWidth; y++) {
      for (var x = 0; x < gridWidth; x++) {
        if (grid[y][x] === "" || grid[y][x] === " ") {
          writeError("Fill all the boxes in please");
          return;
        }
      }
    }
    console.log(grid);
    findWords(grid);
  }

  (function addClickListener() {
    var btn = document.getElementById("btn-solve");
    btn.addEventListener("click", solve);
  })();

  (function addWidthChangeListener() {
    var input = document.getElementById("inp-width");
    input.addEventListener("change", drawGrid);
  })();

  loadDictionary(drawGrid);

};


if (document.readyState != 'loading'){
  app();
} else {
  document.addEventListener('DOMContentLoaded', app);
}