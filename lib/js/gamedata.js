var gruecraft = gruecraft || {};

gruecraft.gamedata = (function()
{
  // TODO put this in map
  var mapRadius = 100;

  var state = 
  {
    version: 0.13,
    freezeClock:false,
    legendShown:false,
    showTravel:false,
    style:"tiles",
    dayCycle:0,
    xStart:-5000000,
    yStart:-5000000,
    xLoc:0,
    yLoc:0,
    discovered:[
//      1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17
    ],
    fogOfWar:false,
    age:2000,
    lightDistance:0.1,
    currentMap:0,
    maps:
    [
      { seed: 42, ascended: false },
      { seed: 0, ascended: false },
      { seed: 0, ascended: false },
      { seed: 0, ascended: false },
      { seed: 0, ascended: false },
      { seed: 0, ascended: false }
    ],
    score:
    {
      age: 2000
    },
    inventory: {},
    buildings: 
    {
      "23225": 
      {
        tile: 18,
        population: 0,
        name: "Village",
        contents: {
          "A small fire":1,
          "Huts":5
        },
        stores: {
          "meat":100,
          "fish":20
        }
      },
      "23215": 
      {
        tile: 19,
        name: "Castle",
        population: 0,
        contents: {
          "A small fire":1,
          "Huts":5
        },
        stores: {
          "meat":100,
          "fish":20
        }
      },
      "20210": 
      {
        tile: 16,
        name: "Outpost",
        population: 0,
        contents: {
          "A small fire":1,
          "Huts":2
        },
        stores: {
          "meat":1,
          "fish":2
        }
      },
      "20200": 
      {
        tile: 17,
        name: "Campsite",
        population: 0,
        contents: {
          "A small fire":1,
          "Huts":2
        },
        stores: {
          "meat":1,
          "fish":2
        }
      }
    }
  };

  var tiles = {};
  var objects = {};
  var items = {};
  var actions = {};
  var effects = {};

  var transients = {
    daylight: 1,
    screenRadiusX: 30,
    screenRadiusY: 15,
    clickTime: 2,
    animating: 0,
    base: "",
    resources: [],
    nearby: []
  };
  
  var init = function()
  {
    // check local storage
    if (typeof(Storage) === "undefined")
    {
      logroll("DANGER! This browser does not support local storage. The game will not be saved and may be unplayable!");
    }

    // first start to the game! Initialize things!
    state.xStart = Math.floor((Math.random() - 0.5) * mapRadius / 5);
    state.yStart = Math.floor((Math.random() - 0.5) * mapRadius / 5);
    state.xLoc = state.xStart;
    state.yLoc = state.yStart;
  }

  return {
    state: state,
    tiles: tiles,
    transients: transients,
    objects: objects,
    items: items,

    init: init
  };

})();
