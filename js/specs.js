
function DictionaryHelper() {
  this.data = {};
}
DictionaryHelper.prototype.addWord = function (word) {
  var letters = word.split("");
  var set = this.data;
  for (var i = 0; i < letters.length; i++) {
    var letter = letters[i];
    if (set[letter] === undefined) {
      set[letter] = {};
    }
    set = set[letter];
  };
  set["&"] = 1;
}
DictionaryHelper.shin = function () {
  var dict = new DictionaryHelper();
  ["hins","hisn","shin","sinh","hin","his","ins","sin","hi","in","is","sh",
   "si"].map(function (word) {
    dict.addWord(word);
  });
  return dict.data;
}
DictionaryHelper.wordbrain = function () {
  var dict = new DictionaryHelper();
  ["shin", "box", "bucket", "barrel", "mail", "padlock", 
   "lamp", "sandpit", "arm"].map(function (word) {
    dict.addWord(word);
  });
  return dict.data;
}


describe('.wordCheck', function () {
  var solver;
  beforeEach(function () {
    solver = new GridSolver(2, DictionaryHelper.shin(), []);
  });
  it ('returns 0 for invalid words', function () {
    var result = solver.wordCheck(['s', 'n', 'h', 'i']);
    expect(result).toBe(0);
  });
  it ('returns 1 for possible words', function () {
    var result = solver.wordCheck(['s', 'h', 'i']);
    expect(result).toBe(1);
  });
  it ('returns 2 for actual words', function () {
    var result = solver.wordCheck(['s', 'h', 'i', 'n']);
    expect(result).toBe(2);
  });
  it ('returns 2 for letters that are both words and possible words', function () {
    var result = solver.wordCheck(['s', 'h']);
    expect(result).toBe(2);
  });
});

describe('.solve', function () {

  function wordChain(chain) {
    return chain.map(function (chainItem) {
      var word = chainItem.reduce(function(w, o) { return w + o.v; }, "");
      return word;
    });
  }
  var start;
  var end;
  beforeEach(function () {
    start = performance.now();
  });
  afterEach(function () {
    end = performance.now();
    console.log((end - start) + "ms");
  })

  it ('results in valid solutions for "shin"', function () {
    var solver = new GridSolver(2, DictionaryHelper.wordbrain(), [4]);
    var options = solver.solve([
      ['s', 'h'],
      ['i', 'n']
    ]);
    expect(options.length).toBe(1);
    var wordChains = options.map(wordChain);
    expect(wordChains).toContain(["shin"]);
  });
  it ('results in valid solutions for "box", "barrel"', function () {
    var solver = new GridSolver(3, DictionaryHelper.wordbrain(), [3, 6]);
    var options = solver.solve([
      ['b', 'x', 'e'],
      ['a', 'r', 'o'],
      ['r', 'b', 'l']
    ]);
    expect(options.length).toBe(1);
    var wordChains = options.map(wordChain);
    expect(wordChains).toContain(["box", "barrel"]);
  });
  it ('results in valid solutions for "mail", "padlock", "lamp", "sandpit", "arm"', function () {
    var solver = new GridSolver(5, DictionaryHelper.wordbrain(), [7, 3, 4, 4, 7]);
    var options = solver.solve([
      ['t', 'i', 'd', 'k', 'c'], 
      ['m', 'n', 'p', 'a', 'o'], 
      ['a', 'l', 'p', 'd', 'l'],
      ['s', 'i', 'a', 'l', 'm'],
      ['a', 'p', 'm', 'r', 'a']
    ]);
    expect(options.length).toBe(1);
    var wordChains = options.map(wordChain);
    expect(wordChains).toContain(["arm", "padlock", "sandpit", "lamp", "mail"]);
  });
});

