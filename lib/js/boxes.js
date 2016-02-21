var gruecraft = gruecraft || {};

gruecraft.boxes = (function()
{
  var myBase = null;

  var updateBase = function()
  {
    var base = gruecraft.mapModule.getBase();
    myBase = base;
    var data = gruecraft.gamedata;
    if (base == "")
    {
      myBase = null;
      return;
    }

    var s = "";
    if (myBase.population > 0)
    {
      s += "<div class='tr'><div class='td'>" + myBase.population + 
        "</div><div class='td'>Villagers</div></div>\n";
    }
    if (typeof base.contents !== 'undefined')
    {
      Object.keys(base.contents).sort().forEach(function(key)
          {
            if (key != "name" && base.contents[key] != 0)
            {
              var num = base.contents[key];
              if (data.items.hasOwnProperty(key) && data.items[key].hasOwnProperty("max") && data.items[key].max == 1)
              {
                num = "";
              }
              s += "<div class='tr'><div class='td'>" + num + 
                "</div><div class='td'>" + key + "</div></div>\n";
            }
          });
    }
    if (s != "")
    {
      s = "<div class='table'>\n" + s + "</div>\n";
    }

    updateStores();
    $("#baseContent").html(s);
    $("#base").removeClass("hidden");
    $("#stores").removeClass("hidden");
  }

  var updateInventory = function()
  {
    var inventory = gruecraft.gamedata.state.inventory;
    var s = "";
    Object.keys(inventory).sort().forEach(function(key)
        {
          if (inventory[key] > 0)
          {
            s += "<a href='#' onClick='gruecraft.boxes.swapItem(" + 
              "\"inventory\",\"stores\",\"" + key + "\",1" + 
              ")'><div class='tr'><div class='td'>" + inventory[key] + 
              "</div><div class='td'>" + key + "</div></div></a>\n";
          }
        });
    if (s != "")
    {
      s = "<div class='table'>\n" + s + "</div>\n";
    }
    $("#inventoryContent").html(s);
  };

  var updateStores = function()
  {
    var s = "";
    if (myBase == null)
    {
      return;
    }
    var stores = myBase.stores;
    // TODO, make clickable and click sends it to inventory
    Object.keys(stores).sort().forEach(function(key)
        {
          if (stores[key] != 0)
          {
            var num = stores[key];
            if (data.items.hasOwnProperty(key) && data.items[key].hasOwnProperty("max") && data.items[key].max == 1)
            {
              num = "";
            }
            s += "<a href='#' onClick='gruecraft.boxes.swapItem(" + 
              "\"stores\",\"inventory\",\"" + key + "\",1" + 
              ")'><div class='tr'><div class='td'>" + num + 
              "</div><div class='td'>" + key + "</div></div></a>\n";
          }
        });
    if (s != "")
    {
      s = "<div class='table'>\n" + s + "</div>\n";
    }
    $("#storesContent").html(s);
  };

  var updateLegend = function()
  {
    // update legend
    var s = "";
    var legend = $("#legendContent");
    var data = gruecraft.gamedata;
    var tileSet = data.tiles.tileSet;
    var length = data.tiles.landTiles.length;
    var ii;
    for (ii = 0; ii < length; ii++)
    {
      if ($.inArray(ii,data.state.discovered) >= 0)
      {
        var tile = tileSet[ii];
        s += "<img src='" + tile.dataURL + "'> " + tile.name + "<br>\n";
      }
    }
    var found = false;
    length += data.tiles.features.length;
    for (; ii < length; ii++)
    {
      if ($.inArray(ii,data.state.discovered) >= 0)
      {
        if (!found)
        {
          s += "<br>\n";
          found = true;
        }
        var tile = tileSet[ii];
        s += "<img src='" + tile.dataURL + "'> " + tile.name + "<br>\n";
      }
    }
    found = false;
    length += data.tiles.buildings.length;
    for (; ii < length; ii++)
    {
      if ($.inArray(ii,data.state.discovered) >= 0)
      {
        if (!found)
        {
          s += "<br>\n";
          found = true;
        }
        var tile = tileSet[ii];
        s += "<img src='" + tile.dataURL + "'> " + tile.name + "<br>\n";
      }
    }
    $("#legendContent").html(s);
  };

  var swapItem = function(loc1,loc2,itemKey,count)
  {
    if (gruecraft.gamedata.state.showTravel)
    {
      return;
    }
    if (myBase == null && 
        ((loc1 == "stores" && loc2 == "inventory") ||
        (loc1 == "inventory" && loc2 == "stores")))
    {
      console.log("null base")
      return;
    }
    if(addItem(loc1,itemKey,-count))
    {
      if (!addItem(loc2,itemKey,count))
      {
        addItem(loc1,itemKey,count);
      }
    }
  };

  var checkItem = function(loc,item,count)
  {
    var logroll = gruecraft.logger.log;
    var data = gruecraft.gamedata;
    if (loc == "base")
    {
      if (myBase == null)
      {
        return false;
      }
      return myBase.contents.hasOwnProperty(item) && myBase.contents[item] >= count;
    }

    var n = data.state.inventory.hasOwnProperty(item) ? 
      data.state.inventory[item] : 0;;
    if (myBase != null && myBase.stores.hasOwnProperty(item))
    {
      n += myBase.stores[item];
    }
    return n >= count;
  };

  var checkLightSource = function(item,count)
  {
    var items = gruecraft.gamedata.items;
    if (items.hasOwnProperty(item))
    {
      var i = items[item];
      if (i.hasOwnProperty("effects") && i.effects.hasOwnProperty("lightSource"))
      {
        var val = i.effects.lightSource;
        if (count > 0)
        {
          if (val > gruecraft.gamedata.state.lightDistance)
          {
            gruecraft.gamedata.state.lightDistance = val;
          }
        }
        else if (gruecraft.gamedata.state.inventory[item] <= -count)
        {
          // need to check everything else
          gruecraft.gamedata.state.lightDistance = 0.1;
          for (var invItem in gruecraft.gamedata.state.inventory)
          {
            if (invItem == item)
              continue;
            checkLightSource(invItem,gruecraft.gamedata.state.inventory[invItem]);
          }
        }
      }
    }
  };

  var addItem = function(loc,item,count)
  {
    var logroll = gruecraft.logger.log;
    var data = gruecraft.gamedata;
    var complete;
    var put;
    switch(loc)
    {
      case "inventory":
        put = gruecraft.gamedata.state.inventory;
        complete = updateInventory;
        checkLightSource(item,count);
        break;
      case "stores":
        put = myBase.stores;
        complete = updateStores;
        break;
      case "base":
        if (myBase == null)
        {
          logroll("No base to store anything in!");
          return false;
        }
        put = myBase.contents;
        complete = updateBase;
        break;
      default:
        console.log("Trying to store %s in %s. Failed.",item,loc);
        return false;
    }
    if (!put.hasOwnProperty(item))
    {
      if (count < 0)
      {
        console.log("No1. Can't take something from " + loc);
        return false;
      }
      put[item] = 0;
    }
    var n = put[item];
    if (n + count < 0)
    {
      console.log("No2");
      return false;
    }
    if (data.items.hasOwnProperty(item) && 
        data.items[item].hasOwnProperty("max") &&
        data.items[item].max < n + count)
    {
      console.log("No3");
      return false;
    }
      
    put[item] = n+count;
    complete();
    gruecraft.storage.storeState();
    return true;
  };

  return {
    updateBase: updateBase,
    updateLegend: updateLegend,
    updateInventory: updateInventory,
    swapItem: swapItem,
    addItem: addItem,
    checkItem: checkItem
  };
})();
