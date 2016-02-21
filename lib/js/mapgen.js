var gruecraft = gruecraft || {};

gruecraft.mapModule = (function(public)
{
  var random;
  var side;
  var max = 100;
  public.map;

  // for sharing with the other module
  public.max = 100;

  var randomSeed = function(s)
  {
    return function()
    {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };

  /* "max" is not the length or width, but how far from 0,0 you can get,
     so if you set max to 2, you should generate a 5x5 grid

     depends on data.landTiles, data.buildings, and data.features
   */
  public.createMap = function()
  {
    var starttime = new Date().getTime();
    var data = gruecraft.gamedata;
    var currentMap = data.state.currentMap;
    var seed = data.state.maps[data.state.currentMap].seed;
    random = randomSeed(seed);
    side = max*2+1;
    public.map = new Array(side);
    var map = public.map;

    // create the 2d array
    for (var ii = 0; ii < side; ii++)
    {
      map[ii] = new Array(side);
      for (var jj = 0; jj < side; jj++)
      {
        map[ii][jj] = -1;
      }
    }
    // Create lightMap
    var lmLength = data.state.maps.length;
    data.tiles.lightMap = new Array(lmLength);
    for (var kk = 0; kk < lmLength; kk++)
    {
      data.tiles.lightMap[kk] = new Array(side);
      for (var ii = 0; ii < side; ii++)
      {
        data.tiles.lightMap[kk][ii] = new Array(side);
        for (var jj = 0; jj < side; jj++)
        {
          data.tiles.lightMap[kk][ii][jj] = 0;
        }
      }
    }

    addLandTiles();
    cleanMap();
    addFeatures();
    addBuildings();

    var duration = new Date().getTime() - starttime;
    console.log("Map[" + currentMap + "] (R:" + max + " S:" + seed + ") generated in " + duration + "ms");
  };

  var addLandTiles = function()
  {
    // set up the weight for random tiles once
    var data = gruecraft.gamedata;
    var map = public.map;
    var landTileWeight = 0;
    var landTiles = data.tiles.landTiles;
    var length = landTiles.length;
    for (var ii = 0; ii < length; ii++)
    {
      landTileWeight += landTiles[ii].weight;
    }

    var tileBin = new Array(length);
    createTile(0,0,map,tileBin,landTileWeight);
    for (var idx = 1; idx <= max; idx++)
    {
      // four sides
      for (var x = idx * -1; x <= idx; x++)
      {
        if (Math.abs(x) == idx)
        {
          for (var y = idx * -1 + 1; y < idx; y++)
          {
            createTile(x,y,map,tileBin,landTileWeight);
          }
        }
        createTile(x,idx,map,tileBin,landTileWeight);
        createTile(x,-1*idx,map,tileBin,landTileWeight);
      }
    }
  };

  var addBuildings = function()
  {
    var tileSet = gruecraft.gamedata.tiles.tileSet
    var buildings = gruecraft.gamedata.state.buildings;
    var map = gruecraft.mapModule;
    for (var pos in buildings)
    {
      var n = parseInt(pos);
      var tile = tileSet[buildings[pos].tile];
      var x = n % side - max;
      var y = -Math.floor(n / side) + max;
      map.setTile(x,y,buildings[pos].tile,map.map);
      var light = tile.light;
      for (var ii = x - light; ii <= x + light; ii++)
      {
        for (var jj = y - light; jj <= y + light; jj++)
        {
          var d = Math.sqrt((x-ii)*(x-ii)+(y-jj)*(y-jj));
          var val = map.getLightMapVal(ii,jj);
          var l = d == 0 ? 9 : Math.floor(1/d*9);
          map.setLightMapVal(ii,jj,Math.max(val,l));
        }
      }
    }
  };

  public.addBuilding = function(pos)
  {
    var tileSet = gruecraft.gamedata.tiles.tileSet
    var buildings = gruecraft.gamedata.state.buildings;
    var map = gruecraft.mapModule;
    var n = parseInt(pos);
    var tile = tileSet[buildings[pos].tile];
    var x = n % side - max;
    var y = -Math.floor(n / side) + max;
    map.setTile(x,y,buildings[pos].tile,map.map);
    var light = tile.light;
    for (var ii = x - light; ii <= x + light; ii++)
    {
      for (var jj = y - light; jj <= y + light; jj++)
      {
        var d = Math.sqrt((x-ii)*(x-ii)+(y-jj)*(y-jj));
        var val = map.getLightMapVal(ii,jj);
        var l = d == 0 ? 9 : Math.floor(1/d*9);
        map.setLightMapVal(ii,jj,Math.max(val,l));
      }
    }
  }

  var addFeatures = function()
  {
    // set up features
    var data = gruecraft.gamedata;
    var map = public.map;
    var start = data.tiles.landTiles.length;
    var end = start + data.tiles.features.length;
    var currentMapLink = data.state.maps[data.state.currentMap];
    var tileSet = data.tiles.tileSet;
    var linkedIdx = 0;
    for (var ii = start; ii < end; ii++)
    {
      var feature = tileSet[ii];
      var n = 0;
      // a negative number is the number of sites. A positive number is
      // per 100 tiles (so 1 is 1 in 100 tiles, 0.1 is 1 in 1000 tiles)
      if (feature.weight < 0)
      {
        n = Math.floor(Math.abs(feature.weight));
      }
      else
      {
        n = side*side/(100/feature.weight);
      }
      var count = 0;
      for (var jj = 0; jj < n; jj++)
      {
        var _x = Math.round(random()*(side-1));
        var _y = Math.round(random()*(side-1));
        // check if it's written to already or if it's ocean / empty
        if (map[_y][_x] <= 0 || map[_y][_x] >= start)
        {
          jj--;
          count++;
          if (count > 10000)
          {
            console.log("Something's wrong. Map is all zero?");
            break;
          }
        }
        else
        {
          map[_y][_x] = ii;
        }
        if (ii == 1)
        {
          // portals, handle these specifically
          if (linkedIdx == data.state.curMap)
          {
            linkedIdx++;
          }
          if (typeof currentMapLink.portal === 'undefined')
          {
            currentMapLink.portal = [];
          }
          currentMapLink.portal = [];
          currentMapLink.portal.push(
              {
                xLoc: _x,
                yLoc: _y,
                linkedTo: linkedIdx
              }
          );
        }
      }
    }
  };

  /**
    Look at all tiles touching this tile but inside where it's being
    generated. Give it a liklihood to generate a similar tile to
    one it's touching, or a random one
  */
  var createTile = function(x, y, map, tileBin, landTileWeight)
  {
    for (var ii = 0; ii < tileBin.length; ii++)
    {
      tileBin[ii] = 0;
    }
    var sum = 0;

    for (var _x = (x-1 < -max ? -max : x-1); _x <= (x+1 > max ? max : x+1); _x++)
    {
      for (var _y = (y-1 < -max ? -max : y-1); _y <= (y+1 > max ? max : y+1); _y++)
      {
        var val = public.getTile(_x,_y, map);
        if (val >= 0)
        {
          tileBin[val]++;
          sum++;
        }
      }
    }

    if (sum == 0)
    {
      public.setTile(x,y,selectRandomTile(landTileWeight),map);
      return;
    }

    // closer to the edge it is, the more chance of it being a 0
    var r = random() * max/6 + 5*max/6;
    if (Math.abs(x) > r || Math.abs(y) > r)
    {
      public.setTile(x,y,0,map);
      return;
    }

    // make it a 90% chance of being a related tile
    var chance = .9;
    r = random();
    if (r >= chance)
    {
      public.setTile(x,y,selectRandomTile(landTileWeight),map);
      return;
    }

    // otherwise, weight the chances by sum so we get something related
    r = Math.floor((r / chance) * sum);
    for (var ii = 0; ii < tileBin.length; ii++)
    {
      if (r < tileBin[ii])
      {
        public.setTile(x,y,ii,map);
        return;
      }
      r -= tileBin[ii];
    }

    return -3;
  };

  var selectRandomTile = function(landTileWeight)
  {
    var r = random() * landTileWeight;
    var landTiles = gruecraft.gamedata.tiles.landTiles;
    var length = landTiles.length;
    for (var ii = 0; ii < length; ii++)
    {
      if (r < landTiles[ii].weight)
      {
        return ii;
      }
      r -= landTiles[ii].weight;
    }
    return -4;
  };

  var cleanMap = function()
  {
    var maxint = 5000000;
    var map = public.map;
    // start at 0,0 and check for every tile that's connected
    var blob = new Array(map.length);
    var blobLength = blob.length;
    for (var ii = 0; ii < blobLength; ii++)
    {
      blob[ii] = new Array(map[ii].length);
      for (var jj = 0; jj < blob[ii].length; jj++)
      {
        blob[ii][jj] = maxint;
      }
    }

    var equiv = [];
    // blob detection, edges are guaranteed to be 0 by map creation
    var blobcount = 0;
    var _yLength = map.length-1;
    for (var _y = 1; _y < _yLength; _y++)
    {
      var _xLength = map[_y].length-1;
      for (var _x = 1; _x < _xLength; _x++)
      {
        if (map[_y][_x] == 0)
        {
          continue;
        }

        n1 = blob[_y-1][_x];
        n2 = blob[_y][_x-1];
        var min = Math.min(n1,n2);
        if (min == maxint)
        {
          equiv.push(blobcount);
          blob[_y][_x] = blobcount++;
        }
        else
        {
          var e_min = maxint;
          if (n1 < maxint)
          {
            e_min = equiv[n1];
          }
          if (n2 < maxint && equiv[n2] < e_min)
          {
            e_min = equiv[n2];
          }

          blob[_y][_x] = e_min;

          // brute force association, but since it's only 2, it's fast
          if (n1 < maxint)
          {
            equiv[equiv[n1]] = e_min;
            equiv[n1] = e_min;
          }
          if (n2 < maxint)
          {
            equiv[equiv[n2]] = e_min;
            equiv[n2] = e_min;
          }
        }
      }
    }

    // a little brute force to clean the list, but /fast/
    found = true;
    while (found)
    {
      found = false;
      var equivLength = equiv.length-1;
      for (var ii = equivLength; ii >= 0; ii--)
      {
        var e1 = equiv[ii];
        var e2 = equiv[equiv[ii]];
        if (e2 != e1)
        {
          equiv[ii] = e2;
          found = true;
        }
      }
    }

    // now get the index at 0,0
    var n = public.getTile(0,0,blob);
    _yLength = map.length;
    for (var _y = 0; _y < _yLength; _y++)
    {
      var _xLength = map[_y].length;
      for (var _x = 0; _x < _xLength; _x++)
      {
        var b = blob[_y][_x];
        if (b == maxint || equiv[b] != n)
        {
          map[_y][_x] = 0;
        }
      }
    }
  };

  return public;

})(gruecraft.mapModule || {});
