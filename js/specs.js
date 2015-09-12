
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
DictionaryHelper.boxbarrel = function () {
  var dict = new DictionaryHelper();
  ["belabor","laborer","rabbler","barbel","barber","barrel","boreal","lobber","rabble",
   "robber","abler","arbor","babel","baler","barbe","barer","barre","blare","blear","bolar",
   "boral","borax","borer","boxer","labor","laxer","lobar","rebar","relax","roble","abbe",
   "able","aero","aloe","axel","axle","babe","bale","barb","bare","bear","blab","blae",
   "bleb","blob","boar","bola","bole","bora","bore","brae","earl","lear","lobe","lore",
   "olea","oral","orle","orra","rale","rare","real","rear","roar","robe","role","abo",
   "alb","ale","arb","are","axe","bal","bar","bel","boa","bob","box","bra","bro","brr",
   "ear","ebb","era","err","lab","lar","lax","lea","lex","lob","lox","oar","obe","ole",
   "ora","orb","ore","rax","reb","rex","rob","roe","ab","ae","al","ar","ax","ba","be",
   "bo","el","er","ex","la","lo","oe","or","ox","re"].map(function (word) {
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

  it ('results in valid solutions for "shin"', function () {
    // based on our dictionary the following grid
    //  [[s, h], [i, n]] should result in 6 possible solutions:
    //  1. shin
    //  2. hins
    //  3. hisn
    //  4. sinh
    //  5. sh, in
    //  6. in, sh
    var solver = new GridSolver(2, DictionaryHelper.shin(), [4]);
    var options = solver.solve([['s', 'h'], ['i', 'n']]);
    expect(options.length).toBe(4);

    var wordChains = options.map(wordChain);

    expect(wordChains).toContain(["shin"]);
    expect(wordChains).toContain(["hins"]);
    expect(wordChains).toContain(["hisn"]);
    expect(wordChains).toContain(["sinh"]);
  });
  it ('results in valid solutions for "box", "barrel"', function () {
    var solver = new GridSolver(3, DictionaryHelper.boxbarrel(), [3, 6]);
    var options = solver.solve([['b', 'x', 'e'], ['a', 'r', 'o'], ['r', 'b', 'l']]);
    expect(options.length).toBe(2);
    var wordChains = options.map(wordChain);

    expect(wordChains).toContain(["box", "barrel"]);
    expect(wordChains).toContain(["lox", "barber"]);
  });
});
