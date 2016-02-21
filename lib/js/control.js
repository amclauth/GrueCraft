var gruecraft = gruecraft || {};

gruecraft.control = (function()
{

  var initPane = function()
  {
    var map = gruecraft.mapModule;
    var data = gruecraft.gamedata;
    var boxes = gruecraft.boxes;

    $("#control").html("");

    initActions();
    updateActions();
  };

  var updateActions = function()
  {
    var data = gruecraft.gamedata;
    var inventory = data.state.inventory;
    var base = gruecraft.mapModule.getBase();
    var stores = base.stores;
    var resources = data.transients.resources;
    var map = gruecraft.mapModule;
    var nearby = data.transients.nearby;

    $("#message").addClass("hidden");

    var tile = data.tiles.tileSet[map.getTile(data.state.xLoc,data.state.yLoc,map.map)];
    if (!tile.hasOwnProperty("canBuild") || typeof tile.canBuild === 'undefined' || !tile.canBuild)
    {
      showMessage("You can't build anything on a " + tile.name);
      return;
    }

    var allowedActions = [];

    for (var actionKey in data.actions)
    {
      var action = data.actions[actionKey];
      var allowed = true;
      if (action.hasOwnProperty("requires")) 
      {
        // check stores, base, resources, inventory, and location

        // location, requires you're in one of the listed locations or
        // not nearby any location
        if (nearby.length != 0)
        {
          allowed = false;
          showMessage("You're too close to the following to build anything: " + nearby.join(","));
        }

        // has required location (or non location)
        var req = action.requires.loc;
        if (allowed && typeof req !== 'undefined')
        {
          if (req.length == 0 && base != "")
          {
            allowed = false;
          }
          else
          {
            if (req.length > 0 && $.inArray(tile.name,req) == -1)
            {
              allowed = false;
            }
          }
        }

        // base
        req = action.requires.base;
        if (allowed && typeof req !== 'undefined')
        {
          if (base == "")
          {
            allowed = false;
          }
          else
          {
            for (var key in req)
            {
              if (!base.contents.hasOwnProperty(key) || base.contents[key] < req[key])
              {
                allowed = false;
                break;
              }
            }
          }
        }

        // resources
        req = action.requires.resources;
        if (allowed && typeof req !== 'undefined')
        {
          for (var ii = 0; ii < req.length; ii++)
          {
            if ($.inArray(req[ii],resources) == -1)
            {
              allowed = false;
              break;
            }
          }
        }

        // stores
        req = action.requires.stores;
        if (allowed && typeof req !== 'undefined')
        {
          if (base == "" || typeof base.stores === 'undefined')
          {
            allowed = false;
          }
          else
          {
            var stores = base.stores;
            for (var key in req)
            {
              if (!stores.hasOwnProperty(key) || stores[key] < req[key])
              {
                allowed = false;
                break;
              }
            }
          }
        }

        // inventory
        req = action.requires.inventory;
        if (allowed && typeof req !== 'undefined')
        {
          for (var key in req)
          {
            if (!inventory.hasOwnProperty(key) || inventory[key] < req[key])
            {
              allowed = false;
              break;
            }
          }
        }
      }
      if (allowed && action.hasOwnProperty("produces"))
      {
        for (var loc in action.produces)
        {
          if (!allowed)
          {
            break;
          }
          for (var item in action.produces[loc])
          {
            if (data.items.hasOwnProperty(item) && 
                data.items[item].hasOwnProperty("max"))
            {
              var max = data.items[item].max;
              var count = 0;
              if (inventory.hasOwnProperty(item))
              {
                count += inventory[item];
              }
              if (base != "" && stores.hasOwnProperty(item))
              {
                count += stores[item];
              }
              if (base != "" && base.contents.hasOwnProperty(item))
              {
                count += base.contents[item];
              }
              if (action.produces[loc][item] + count > max)
              {
                allowed = false;
                break;
              }
            }
          }
        }
      }
      if (allowed)
      {
        showAction(actionKey);
      }
      else
      {
        hideAction(actionKey);
      }
    }
  };

  var showMessage = function(message)
  {
    $("#message").html(message);
    $("#message").removeClass("hidden");
  };

  var initActions = function()
  {
    $("#control").append(
        "<div class=\"hidden\" id=\"message\"></div>"
        );
    Object.keys(gruecraft.gamedata.actions).sort().
      forEach(function(key)
        {
          addAction(key);
        });
  };

  var showAction = function(actionKey)
  {
    var divId = actionKey.replace(/\W/g,'');
    $("#action" + divId).removeClass("hidden");
  };

  var hideAction = function(actionKey)
  {
    var divId = "#action" + actionKey.replace(/\W/g,'');
    if (!$(divId).find('.animating').length)
    {
      $(divId).addClass("hidden");
    }
  };

  var addAction = function(actionKey)
  {
    var divId = actionKey.replace(/\W/g,'');
    $("#control").append(
        "<div class='hidden' id=\"action" + divId + "\">" + 
        "<a href='#' class='btn-action-href'" + 
        "onClick='gruecraft.control.performAction(event,this,\"" + 
        actionKey + "\")'>" + 
        "<div class='progress btn-action'>" +
        "<span class='btn-action-progress'>" + actionKey + "</span>" + 
        "<div class='progress-bar' style='width:100%'>" +
        "</div></div></a></div>");
  }

  var performAction = function(event,button,actionKey)
  {
    event.preventDefault();
    $(button).removeClass("active");
    $(button).blur(); // hide the "focus" look and feel
    var bar = $(button).find(".progress-bar");
    if ($(bar).hasClass("animating"))
    {
      return;
    }

    var action = gruecraft.gamedata.actions[actionKey];
    console.log("Action: %s", actionKey);
    // have to verify we have everything first
    // verify also we aren't building a base-producing item too near a base
    for (var loc in action.requires)
    {
      if (loc == "loc" || loc == "resources")
      {
        continue;
      }
      for (var item in action.requires[loc])
      {
        var n = action.requires[loc][item];
        if (!gruecraft.boxes.checkItem(loc,item,-n))
        {
          console.log("not enough %s in %s (%d)",item,loc,n);
          return;
        }
      }
    }
    for (var loc in action.requires)
    {
      if (loc != "loc" && loc != "resources")
      {
        for (var item in action.requires[loc])
        {
          var n = action.requires[loc][item];
          if (!gruecraft.boxes.addItem(loc,item,-n))
          {
            return;
          }
        }
      }
    }
    $(bar).addClass("animating");
    gruecraft.gamedata.transients.animating++;
    var time = gruecraft.gamedata.transients.clickTime * action.time * 1000;
    updateActions();
    $(bar).animate(
      {
        width: "0%"
      }, 
      time,
      "linear",
      function()
      {
        $(bar).width('100%');
        $(bar).removeClass("animating");
        processActionComplete(action);
      }
    );
  };

  var processActionComplete = function(action)
  {
    var produces = action.produces;
    var boxes = gruecraft.boxes;
    var data = gruecraft.gamedata;
    var state = data.state;
    var map = gruecraft.mapModule;
    if (produces.hasOwnProperty("loc"))
    {
      // maybe a new base!
      var tile = null;
      var length = data.tiles.tileSet.length;
      var tilenum = 0;
      for (var ii = 0; ii < length; ii++)
      {
        if (data.tiles.tileSet[ii].name == produces.loc)
        {
          tile = data.tiles.tileSet[ii];
          tilenum = ii;
          break;
        }
      }
      if (tile == null)
      {
        console.log("Uh oh. Can't find a tile to match %s",produces.loc);
        return;
      }
      gruecraft.mapModule.getOrCreateBase(produces.loc,tilenum);
    }
    for (var loc in produces)
    {
      if (loc == "loc")
      {
        continue;
      }
      for (var obj in produces[loc])
      {
        var n = produces[loc][obj];
        boxes.addItem(loc,obj,n);
      }
    }
    gruecraft.gamedata.transients.animating--;
    gruecraft.control.updateActions();
    gruecraft.storage.storeState();
  };

  return {
    initPane: initPane,
    updateActions: updateActions,
    performAction: performAction,
    showMessage: showMessage
  };
})();
