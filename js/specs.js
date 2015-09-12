
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
    dict.addWord('shin');
    dict.addWord('hins');
    dict.addWord('hisn');
    dict.addWord('sinh');
    dict.addWord('hin');
    dict.addWord('ins');
    dict.addWord('sin');
    dict.addWord('his');
    dict.addWord('hi');
    dict.addWord('sh');
    dict.addWord('in');
    dict.addWord('is');
    dict.addWord('si');
    return dict.data;
}

describe('.wordCheck', function () {
  var solver;
  beforeEach(function () {
    solver = new GridSolver(2, DictionaryHelper.shin());
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
  var solver;
  beforeEach(function () {
    solver = new GridSolver(2, DictionaryHelper.shin());
  });
  it ('results in valid solutions', function () {
    // based on our dictionary the following grid
    //  [[s, h], [i, n]] should result in 6 possible solutions:
    //  1. shin
    //  2. hins
    //  3. hisn
    //  4. sinh
    //  5. sh, in
    //  6. in, sh
    var options = solver.solve([['s', 'h'], ['i', 'n']]);
    expect(options.length).toBe(6);

    var wordChains = options.map(function (chain) {
      return chain.map(function (chainItem) {
        var word = chainItem.reduce(function(w, o) { return w + o.v; }, "");
        return word;
      });
    });
    console.log(wordChains);
    expect(wordChains).toContain(["shin"]);
    expect(wordChains).toContain(["hins"]);
    expect(wordChains).toContain(["hisn"]);
    expect(wordChains).toContain(["sinh"]);
    expect(wordChains).toContain(["sh", "in"]);
    expect(wordChains).toContain(["in", "sh"]);
  });
});
