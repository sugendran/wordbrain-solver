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
    var html = [];
    solution.map(function (chainItem) {
      var word = chainItem.reduce(function(w, o) { return w + o.v; }, "");
      html.push(word);
    });
    return html.join("<span>, <span>") + "<br />";
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
    var solver = new GridSolver(gridWidth, dictionary);
    var solutions = solver.solve(grid);
    var html = solutions.map(solutionHTML);
    resultDiv.innerHTML = html.join("");
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