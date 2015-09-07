var msgpack = require('msgpack-js');
var wordnet = require('wordnet');
var wordtest = new RegExp("^[a-zA-Z]+$");


var alphabet = "abcdefghijklmnopqrstuvwxyz";
var data = {};

function addWord (word) {
  var letters = word.split("");
  var set = data;
  for (var i = 0; i < letters.length; i++) {
    var letter = letters[i];
    if (set[letter] === undefined) {
      set[letter] = {};
    }
    set = set[letter];
  };
  set["&"] = 1;
}

function isWord (str) {
  return wordtest.test(str);
}

wordnet.list(function (err, list) {
  if (err) { throw err; }
  list.filter(isWord).forEach(addWord);
  console.log(JSON.stringify(data, null, 1));
  // console.log(msgpack.encode(data).toString());
});


/*
 {
  a: {
    n: {
      t: [ 
        1,
        h: [
          0,
          i: {
              l: {
                l: {
    
                }
              }
            }
        ]
      ]
    }
  }
 }
*/