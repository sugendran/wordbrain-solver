var fs = require('fs');
var path = require('path');
var wordtest = new RegExp("^[a-zA-Z]+$");


var alphabet = "abcdefghijklmnopqrstuvwxyz";
var data = {};

function addWord (word) {
  var letters = word.toLowerCase().split("");
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

// smaller list of known words to help make the solving faster
var list = ["Igloo","Paddle","Game","Odd","Fork","Log","Large","Toaster","Stairs","Cabbage","Vampire","Period","Faucet","Trophy","Moss","Pyramid","Doghouse","Cannon","Toilet","Panda","Feather","Spinach","Steak","Mail","Thumb","Lamp","Coconut","Rope","Stereo","Whale","Female","Cube","Sandpit","Arm","Palm","Padlock","Lighter","Hoe","Honey","Owl","Panties","Plum","Center","Medicine","Headband","Idea","Stilts","Pumpkin","Gap","Collar","Window","Axe","Dustbin","Bag","Lapel","Eat","Football","Mirror","Pump","Eskimo","Kitchen","Left","Dart","Pirate","Trombone","Hook","Pie","Drill","Stripe","Key","Triplets","Aerial","South","Pulltab","Painter","Stop","Mosquito","Tooth","Goldfish","Nut","Blouse","Wing","String","Cyclops","Cactus","No","Chin","Trowel","Oval","Kite","Goat","Sail","Mast","Path","Cork","Sofa","Sink","Doll","Slide","Kayak","Duck","Cheese","Fan","Pigsty","Fly","Eyeball","Candle","Bed","Beard","Meat","Lemon","Face","Egg","Tennis","Castle","Tin","Book","Elbow","Skis","Snail","Jam","Puzzle","Mince","File","Tug","Target","Carrot","Petal","Sock","Thin","Wheel","Gun","Cart","Happy","Roof","Field","Spot","Screw","Shovel","Dog","Card","Melon","Well","Tv","Skull","Tent","Sun","Waffle","Square","Cheek","Edge","Smoke","Bread","Olive","Noose","Talk","Dress","Fish","Shout","Chair","Rabbit","Oar","Barn","Socks","Sickle","Japan","Nail","Cream","Grass","Ruler","Thick","Bite","Ghost","Shin","Piano","Raft","Trunk","Earth","Bolt","Male","Heart","Dice","Box","Barrel","Empty","Bell","Straw","Doctor","Elk","Tail","Mouth","Yacht","Milk","Peach","Onion","Soap","Knife","Comb","Swan","Angle","Jug","Table","Record","North","Cupboard","Lantern","Ask","Pencil","Sheep","Celery","Tongue","Crow","Nurse","Butter","Bacon","Drink","Bat","Dream","Cabin","Gloves","Keyring","Bullet","Orange","Hatchet","Flag","Neck","Starfish","Switch","Tricycle","Jump","Necktie","Spray","Saw","Hen","Finger","Scissors","Wink","Heel","Cow","Music","Boot","Dentist","Cap","Skirt","Sugar","Ham","Bedroom","Belt","Brick","Medal","Icicle","Balls","Maze","Peas","Blow","Necklace","Dynamite","Launch","Moon","Sheriff","Bottle","Shoelace","Cup","Rocket","Plate","Negative","Eagle","Hat","Witch","Broom","Picture","Balloon","Tall","Doorbell","Small","Cake","Magnet","Golf","Plane","Onions","Brush","Profit","Flagpole","Tomato","Glass","Moth","Lip","Down","Full","Percent","Envelope","Robot","Crown","Fang","Think","Upstairs","Trousers","Birthday","Pear","Block","Helmet","Divide","Cemetery","Mouse","Spoon","Timber","Twins","Barbell","Tepee","Boots","Root","Haystack","Shoes","Anchor","Scooter","Chimney","Crab","Biscuit","Smell","Camera","Volcano","Kitten","Bathroom","Soup","Bald","Patient","Elevator","Bomb","Infinity","Floor","Buckle","Loop","Canoe","Mailbox","Snowman","Punch","Pumplin","Deep","Strak","Sad","Paint","Label","Slippers","Ladder","Bee","Porridge","Peace","Turtle","Pen","Pliers","Mittens","Shirt","Shorts","Scarf","Patch","Raincoat","Lollipop","Umbrella","House","Bow","Horse","Sing","Woodpile","Scale","Fruit","Fence","Hanball","Joker","Cane","Vitamin","Sword","Board","Banana","Iron","Pancake","Poison","Fold","Purse","Tie","Dinosaur","Earring","Wolf","Handball","Mushroom","Dominoes","Listen","Postcard","Planet","Kick","Money","Marble","Whisper","Knee","Eye","Vertical","Missile","Right","Bone","Up","Question","Knuckle","Laugh","Salt","Fin","Shield","Duckling","Surgery","Silo","Cufflink","Mountain","Stinger","Lens","Clam","Elephant","Overbite","Safe","Flower","Windmill","Shark","Ball","Tweezers","Corner","Nose","Lorry","Stern","Beetroot","Scales","Sign","Pig","Antenna","Rooster","Drip","Cherry","Muscle","Lawn","Multiply","Eraser","Cashier","Meadow","Cucumber","Smile","Iceberg","Shower","Pipe","Customer","Arrow","Clown","Keyhole","Unicycle","Pepper","Crack","Jar","Wide","Saucer","Suitcase","Compass","Saucepan","Middle","Shallow","Church","Butcher","Ferry","Anvil","Rifle","Jacket","Pillar","Big","Overlap","Cookie","Monkey","Glue","Chainsaw","Ship","Teapot","Shoulder","Potato","Chain","Nightie","Sausage","Napkin","Teardrop","Monster","Ladybug","Saddle","Sawdust","Globe","Zipper","Swing","Door","Grenade","Apple","Prism","Turkey","Lava","Grapes","Scar","Beehive","Chicken","Cereal","Fist","Corn","Diagonal","Hammer","Whistle","Stride","Price","Cat","Salute","Funnel","Snorkel","Tree"];

list.filter(isWord).forEach(addWord);
var outPath = path.join(__dirname, '..', 'data', 'dictionary.json');
fs.writeFile(outPath, JSON.stringify(data));



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