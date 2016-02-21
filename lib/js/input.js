var gruecraft = gruecraft || {};

gruecraft.input = (function()
{
  var onKeyDown = function(event)
  {
    if (gruecraft.gamedata.state.freezeClock)
    {
      return;
    }
    switch (event.which)
    {
      case 65:
      case 37: //left
        event.preventDefault();
        doMove(-1,0);
        break;
      case 68:
      case 39: //right
        event.preventDefault();
        doMove(1,0);
        break;
      case 87:
      case 38: //up
        event.preventDefault();
        doMove(0,1);
        break;
      case 83:
      case 40: //down
        event.preventDefault();
        doMove(0,-1);
        break;
    }
  };

  var doMove = function(_x,_y)
  {
    var map = gruecraft.mapModule;
    var data = gruecraft.gamedata;
    var screen = gruecraft.screen;
    var logroll = gruecraft.logger.log;
    var storage = gruecraft.storage;
    var control = gruecraft.control;
    var events = gruecraft.events;

    if (!data.state.showTravel)
    {
      return;
    }

    if (data.transients.animating > 0)
    {
      logroll("You can't move while you're working!");
      return;
    }

    var d = map.getTile(data.state.xLoc+_x,data.state.yLoc+_y,map.map);
    if (d == 0)
    {
      return;
    }
    data.state.xLoc += _x;
    data.state.yLoc += _y;
  //  var startTime = new Date().getTime();
    checkDiscoveries();
    checkResources();
    map.createMapSegment();
    screen.printScreen();
    var t = data.tiles.tileSet[d];
    logroll("<img src='" + t.dataURL + "'> " + t.desc);
    events.locationEvent();
  //  console.log("Move Duration: " + (new Date().getTime() - startTime));
  };

  var checkDiscoveries = function()
  {
    var map = gruecraft.mapModule;
    var data = gruecraft.gamedata;
    var storage = gruecraft.storage;
    var style = gruecraft.style;
    var boxes = gruecraft.boxes;
    var resources = [];

    var found = false;
    var distance = Math.floor(data.state.lightDistance + .999);
    for (var ii = -distance; ii <= distance; ii++)
    {
      for (var jj = -distance; jj <= distance; jj++)
      {
        var t = map.getTile(data.state.xLoc+ii,data.state.yLoc+jj,map.map);
        map.setLightMapDiscovered(data.state.xLoc+ii,data.state.yLoc+jj);
        if ($.inArray(t,data.state.discovered) == -1)
        {
          found = true;
          data.state.discovered.push(t);
        }
      }
    }
    storage.storeState();
    storage.storeLightMap();
    if (found)
    {
      boxes.updateLegend();
    }
  };

  var checkResources = function()
  {
    var map = gruecraft.mapModule;
    var data = gruecraft.gamedata;
    var resources = [];
    var nearby = [];

    for (var ii = -2; ii <= 2; ii++)
    {
      for (var jj = -2; jj <= 2; jj++)
      {
        var t = map.getTile(data.state.xLoc+ii,data.state.yLoc+jj,map.map);
        var tile = data.tiles.tileSet[t];
        if (!(ii == 0 && jj == 0) && tile.hasOwnProperty("resources"))
        {
          for (var kk = 0; kk < tile.resources.length; kk++)
          {
            if ($.inArray(tile.resources[kk],resources) == -1)
            {
              resources.push(tile.resources[kk]);
            }
          }
        }
        if (!(ii == 0 & jj == 0) && t >= data.tiles.landTiles.length)
        {
          if ($.inArray(tile.name,nearby) == -1)
          {
            nearby.push(tile.name);
          }
        }
      }
    }

    data.transients.nearby = nearby.sort();
    data.transients.resources = resources.sort();
    var r = resources.sort().join("<br>");
    $("#resourcesContent").html(r);
  };

  return {
    checkDiscoveries: checkDiscoveries,
    checkResources: checkResources,
    doMove: doMove,
    onKeyDown: onKeyDown
  };
})();
