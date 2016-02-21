var gruecraft = gruecraft || {};

gruecraft.mapModule = (function(public)
{
  var max = 100;
  /*
     This lightmap serves two purposed. First, it allows villages and structures
     to illuminate their surroundings slightly at night. Second, it tells us 
     which tiles are discovered.
     Initially, all values are 0. When discovered, they're set to 1
     To store on the server, we're trying to limit space, so we'll use 1-9 as 
     the actual light modification value. So 2 will be a 1/9 alpha (for
     discovered land), and 9 will be for bright castles and villages
  */
  public.setLightMapDiscovered = function(x,y)
  {
    var _x = x+public.max;
    var _y = -y+public.max;
    var lm = gruecraft.gamedata.state.currentMap;
    var lightMap = gruecraft.gamedata.tiles.lightMap;
    var val = lightMap[lm][_y][_x];
//    var val3 = gruecraft.mapModule.getLightMapVal(x,y);
//    console.log("%d,%d  %d,%d,%d %d -> %d",x,y,lm,_y,_x,val,val3);
    if (val > 0)
      return;

    lightMap[lm][_y][_x] = 1;
//    var val2 = lightMap[lm][_y][_x];
//    val3 = gruecraft.mapModule.getLightMapVal(x,y);
//    console.log("%d,%d  %d,%d,%d %d -> %d -> %d",x,y,lm,_y,_x,val,val2,val3);
    return;
  };

  public.setLightMapVal = function(x,y,val)
  {
    var _x = x+public.max;
    var _y = -y+public.max;
    var lm = gruecraft.gamedata.state.currentMap;

    gruecraft.gamedata.tiles.lightMap[lm][_y][_x] = val;
  };

  public.getLightMapVal = function(x,y)
  {
    var _x = x+public.max;
    var _y = -y+public.max;
    var lm = gruecraft.gamedata.state.currentMap;

    return gruecraft.gamedata.tiles.lightMap[lm][_y][_x];
  };

  public.getTile = function(x, y, _map)
  {
    var _x = x+public.max;
    var _y = -y+public.max;
    return _map[_y][_x];
  };

  public.setTile = function(x, y, value, _map)
  {
    var _x = x+public.max;
    var _y = -y+public.max;
    _map[_y][_x] = value;
  };

  public.createMapSegment = function()
  {
    var font = gruecraft.font.data;
    var data = gruecraft.gamedata;
    var map = gruecraft.mapModule;
    var xLoc = data.state.xLoc;
    var yLoc = data.state.yLoc;
    var screenRadiusX = data.transients.screenRadiusX;
    var screenRadiusY = data.transients.screenRadiusY;
    var fog = data.state.fogOfWar;
    var blanktile = data.tiles.landTiles[0];
    var tilesOnly = font.tilesOnly;
    var screen = gruecraft.screen;

    for (var _y = yLoc - screenRadiusY; _y <= yLoc + screenRadiusY; _y++)
    {
      for (var _x = xLoc - screenRadiusX; _x <= xLoc + screenRadiusX; _x++)
      {
        var tileVal;
        var xDistance = Math.abs(xLoc - _x);
        var yDistance = Math.abs(yLoc - _y);
        // base alpha
        var alpha = data.transients.daylight;
        // base alpha in fog
        if (fog)
        {
          alpha = alpha * (1 - Math.min(xDistance / screenRadiusX*2,1)) * 
            (1 - Math.min(yDistance / screenRadiusY*2,1));
        }
        // add lightmap alpha
        var lmAlpha = 0;
        if (alpha < 1 && !fog)
        {
          var lmVal = map.getLightMapVal(_x,_y);
          if (lmVal != 0)
          {
            if (lmVal == 1)
            {
              lmAlpha = 0.02;
            }
            else
            {
              lmAlpha = (lmVal-1)/8;
            }
          }
        }
        // add personal light value
        var d = Math.sqrt(xDistance*xDistance+yDistance*yDistance);
        var lightDistance = data.state.lightDistance;
        var pAlpha = 0;
        var ceil = Math.ceil(lightDistance);
        if (xDistance <= ceil && yDistance <= ceil && d != 0)
        {
          pAlpha = 1/d * lightDistance/ceil;
        }
        alpha += (1-alpha)*Math.max(lmAlpha,pAlpha);

        // get tile value
        if (Math.abs(_y) > max ||
            Math.abs(_x) > max)
        {
          tileVal = blanktile;
        }
        else
        {
          if (_x == xLoc && _y == yLoc)
          {
            tileVal = data.objects.player;
            alpha = 1;
          }
          else 
          {
            var v = map.getTile(_x,_y,map.map);
            tileVal = data.tiles.tileSet[v];
          }
        }

        if (tilesOnly)
        {
          screen.setTile(_x,_y,tileVal.tile,alpha);
        }
        else
        {
          screen.setTile(_x,_y,tileVal.tile,alpha,tileVal.fgColorIdx,tileVal.bgColorIdx);
        }
        first = false;
      }
    }
  };

  public.getCurrentPosition = function()
  {
    var state = gruecraft.gamedata.state;
    return (-state.yLoc + max)*(max*2+1) + state.xLoc + max;
  }

  public.getBase = function()
  {
    var state = gruecraft.gamedata.state;
    var pos = gruecraft.mapModule.getCurrentPosition();
    if (state.buildings.hasOwnProperty(pos))
    {
      return state.buildings[pos];
    }
    return "";
  };

  public.getOrCreateBase = function(name,tileIdx)
  {
    var state = gruecraft.gamedata.state;
    var pos = gruecraft.mapModule.getCurrentPosition();
    var base;
    if (!state.buildings.hasOwnProperty(pos))
    {
      state.buildings[pos] = {};
      var base = state.buildings[pos];
      base.contents = {};
      base.stores = {};
      base.population = 0;
      gruecraft.events.startBaseEventTimer(pos);
    }
    else
    {
      base = state.buildings[pos];
    }
    base.name = name;
    base.tile = tileIdx;
    $("#baseTitle").html(name);

    gruecraft.mapModule.addBuilding(pos);
    map.createMapSegment();
    gruecraft.screen.printScreen();
    gruecraft.boxes.updateBase();
  }

  return public;
})(gruecraft.mapModule || {});
