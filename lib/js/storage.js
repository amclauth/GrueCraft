var gruecraft = gruecraft || {};

gruecraft.storage = (function()
{
  var stateString = "rgbts.gruecraft.gamestate";
  var lightMapString = "rbgts.gruecraft.lightMap";

  var storeState = function()
  {
    var s = JSON.stringify(gruecraft.gamedata.state);
    localStorage.setItem(
      stateString,
      JSON.stringify(gruecraft.gamedata.state)
    );
  };

  var storeLightMap = function()
  {
    var lm = gruecraft.gamedata.tiles.lightMap;
    if (typeof lm !== 'undefined')
    {
      localStorage.setItem(
        lightMapString,
        JSON.stringify(lm)
      );
    }
  };

  var getState = function()
  {
    var obj = localStorage.getItem(stateString);
    var state = gruecraft.gamedata.state;
    if (obj != null)
    {
      var size = unescape(encodeURIComponent(JSON.stringify(obj))).length;
      var txt = "B";
      if (size > 1024)
      {
        size = size / 1024;
        txt = "kB";
      }
      if (obj != "")
      {
        var json = JSON.parse(obj);
        // non destructive copy to pick up new fields
        console.log("Server Version{%s}: Save Version{%s}",
            state.version,json.version);
        if (state.version != json.version)
        {
          log("Your version is out of date. You may need to reset");
        }
        for (var key in json)
        {
          if (typeof json[key] !== 'undefined')
          {
            state[key] = json[key];
          }
        }
        console.log("Retreived game state (%d %s): %O",
            size, txt, gruecraft.gamedata.state);
      }
    }
    obj = localStorage.getItem(lightMapString);
    if (obj !== null && obj != "")
    {
      var size = unescape(encodeURIComponent(JSON.stringify(obj))).length;
      var txt = "B";
      if (size > 1024)
      {
        size = size / 1024;
        txt = "kB";
      }
      gruecraft.gamedata.tiles.lightMap = JSON.parse(obj);
      console.log("Retrieved light map (%d %s): %O", 
          size, txt, gruecraft.gamedata.tiles.lightMap);
    }
  };

  var clearStorage = function()
  {
    localStorage.removeItem(stateString);
    localStorage.removeItem(lightMapString);
  };

  return {
    storeState: storeState, 
    getState: getState, 
    storeLightMap: storeLightMap, 
    clearStorage: clearStorage, 
  };

})();
