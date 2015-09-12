function app() {

  var errorDiv =  document.getElementById("errors");
  var gridDiv = document.getElementById("grid");
  var resultDiv = document.getElementById("results");
  var wordSizeList = document.getElementById("word-size-list");
  var dictionary = {};
  var gridWidth = 2;
  var wordSizes = [];

  function writeError(str) {
    errorDiv.innerHTML = "<h4>" + str + "</h4>";
  }

  function loadDictionary (next) {
    var request = new XMLHttpRequest();
    request.open('GET', 'data/dictionary.json', true);

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

  function gridHTML (chain) {
    var html = [];
    for (var y = 0; y < gridWidth; y++) {
      html.push('<div class="grid-row">');
      for (var x = 0; x < gridWidth; x++) {
        var vals = chain.filter(function (item) {
          return item.x === x && item.y === y;
        });
        var val = vals.length === 0 ? "" : vals[0].v;
        html.push('<input type="text" disabled size="1" value="' + val + '" />');
      }
      html.push('</div>');
    };
    return html.join("");
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

  function solutionHTML (solution) {
    var html = ["<hr />"];
    solution.map(function (chainItem) {
      html.push("<h6>");
      var word = chainItem.reduce(function(w, o) { return w + o.v; }, "");
      html.push(word);
      html.push("</h6>");
      html.push("<div>");
      html.push(gridHTML(chainItem));
      html.push("</div>");
    });
    return html.join("");
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
      grid[y][x] = element.value.replace(" ", "").toLowerCase();
    }
    for (var y = 0; y < gridWidth; y++) {
      for (var x = 0; x < gridWidth; x++) {
        if (grid[y][x] === "" || grid[y][x] === " ") {
          writeError("Fill all the boxes in please");
          return;
        }
      }
    }
    var sum = wordSizes.reduce(function (a, b) { return a + b; }, 0);
    if (sum !== gridWidth * gridWidth) {
      writeError("Please make sure the required word sizes are correct");
      return;
    }

    errorDiv.innerHTML = "";
    resultDiv.innerHTML = "";
    var start = performance.now();
    var solver = new GridSolver(gridWidth, dictionary, wordSizes);
    var solutions = solver.solve(grid);
    var end = performance.now();
    var html = solutions.length === 0 ? ["failed to solve"]  : solutions.map(solutionHTML);
    resultDiv.innerHTML = html.join("") + "<hr />" + "Completed in " + (end - start) + "ms";
  }

  function drawWordSizes() {
    wordSizeList.innerHTML = wordSizes.map(function (s) {
      //&#x2610 == ballot box;
      var html = ["<li>"];
      for (var i = 0; i < s; i++) {
        html.push("&#x2610;");
      };
      html.push("</li>");
      return html.join("");
    }).join("");
  }
 
  function addWordSize() {
    var size = parseInt(document.getElementById("inp-size").value, 10);
    wordSizes.push(size);
    var sum = wordSizes.reduce(function (a, b) { return a + b; }, 0);
    if (sum > gridWidth * gridWidth) {
      writeError("Required word sizes are larger than the space in the grid! Reset and start again.");
    }
    drawWordSizes();
  }

  function reset() {
    errorDiv.innerHTML = "";
    resultDiv.innerHTML = "";
    wordSizes = [];
    wordSizeList.innerHTML = "<li>No word sizes set</li>"
    drawGrid();
  }

  (function () {
    var btn = document.getElementById("btn-solve");
    btn.addEventListener("click", solve);

    var inputWidth = document.getElementById("inp-width");
    inputWidth.addEventListener("change", drawGrid);

    var btnAdd = document.getElementById("btn-add");
    btnAdd.addEventListener("click", addWordSize);

    var btnReset = document.getElementById("btn-reset");
    btnReset.addEventListener("click", reset);
  })();

  loadDictionary(drawGrid);

};


if (document.readyState != 'loading'){
  app();
} else {
  document.addEventListener('DOMContentLoaded', app);
}