var gruecraft = gruecraft || {};

gruecraft.style = (function()
{

  var successCallback;

  var addClickListeners = function(success)
  {
    var storage = gruecraft.storage;
    var map = gruecraft.mapModule;
    var screen = gruecraft.screen;
    var timer = gruecraft.timer;
    var input = gruecraft.input;
    var logger = gruecraft.logger;

    $("#asciiToggle").click(function()
    {
      setStyle("ascii",success);
    });
    $("#tileToggle").click(function()
    {
      setStyle("tiles",success);
    });
    $("#fogofwarToggle").click(function()
    {
      data.state.fogOfWar = !data.state.fogOfWar;
      storage.storeState();
      map.createMapSegment();
      screen.printScreen();
    });
    $("#resetButton").click(function()
    {
      if (window.confirm("Are you sure you want to reset?"))
      {
        doReset();
      }
    });
    if ($("#legend").length)
    {
      // in the game screen
      if (data.state.legendShown)
      {
        $("#legend").toggleClass("hidden");
        data.state.showLegend = true;
      }
      setTravelState();

      $("#mapCanvas").click(function(e)
      {
        e.preventDefault();
        var w = screen.getWidth();
        var h = screen.getHeight();
        var _x = e.offsetX ? e.offsetX : e.pageX - $("#mapCanvas").offset().left;
        var _y = e.offsetY ? e.offsetY : e.pageY - $("#mapCanvas").offset().top;
        if (_x < w / 4)
        {
          input.doMove(-1,0);
        }
        else if (_x > w - w / 4)
        {
          input.doMove(1,0);
        }
        else if (_y < h / 4)
        {
          input.doMove(0,1);
        }
        else if (_y > h - h / 4)
        {
          input.doMove(0,-1);
        }
      });
      $("#legendToggle").click(function()
      {
        $("#legend").toggleClass("hidden");
        data.state.legendShown = !data.state.legendShown;
        storage.storeState();
      });
      $("#clockToggle").click(function()
      {
        data.state.freezeClock = !data.state.freezeClock;
        $("#clockToggle").html(
          (data.state.freezeClock ? "Resume" : "Pause"));
        logger.log((data.state.freezeClock ? "Time is frozen" : 
            "Tomorrow, and tomorrow, and tomorrow, creeps in this petty pace from day to day"));
        storage.storeState();
      });
      $("#swapButton").click(function()
      {
        data.state.showTravel = !data.state.showTravel;
        storage.storeState();
        setTravelState();
      });
    }
    else
    {
      $("#legendToggle").hide();
      $("#clockToggle").hide();
      $("#fogofwarToggle").hide();
      $("#resetButton").hide();
    }

    $(window).resize(function()
    {
      waitForFinalEvent(function()
      {
        screen.init();
        map.createMapSegment();
        screen.printScreen();
      }, 250, "styleResizer");
    });
  };

  var waitForFinalEvent = (function()
  {
    var timers = {};
    return function (callback, ms, uniqueId)
    {
      if (timers[uniqueId])
      {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();
  
  var setTravelState = function()
  {
    var data = gruecraft.gamedata;
    var control = gruecraft.control;

    if (data.state.showTravel)
    {
      $("#map_pane").removeClass("hidden");
      $("#control").addClass("hidden");

      $("#swapButton").text("To Work");
      $("#base").addClass("hidden");
      $("#stores").addClass("hidden");
    }
    else
    {
      $("#map_pane").addClass("hidden");
      $("#control").removeClass("hidden");

      $("#swapButton").text("To Travel");
      var d = map.getTile(data.state.xLoc,data.state.yLoc,map.map);
      var dStart = data.tiles.landTiles.length + data.tiles.features.length;
      var dStop = dStart + data.tiles.buildings.length;
      if (d >= dStart && d < dStop)
      {
        var name = data.tiles.tileSet[d].name;
        $("#baseTitle").html(name);
        $("#base").removeClass("hidden");
        $("#stores").removeClass("hidden");
      }
      else
      {
        $("#base").addClass("hidden");
        $("#stores").addClass("hidden");
      }

      gruecraft.control.updateActions();
      gruecraft.boxes.updateBase();
    }
  };

  var doReset = function()
  {
    timer.stopTimers();
    data.state.freezeClock = true;
    storage.clearStorage();
    location.reload();
  };

  var addTileArray = function(tileSet, array)
  {
    var length = array.length;
    for (var ii = 0; ii < length; ii++)
    {
      tileSet.push(array[ii]);
    }
  };

  var setStyle = function(name, success, failure)
  {
    var startTime = new Date().getTime();
    var data = gruecraft.gamedata;
    var logroll = gruecraft.logger.log;
    successCallback = success;
    data.state.style = name;
    $.getJSON("lib/styles/" + name + "/data.json", function() 
      {
        console.log("Sent query for " + name + "/data.json");
      })
      .done(function(json)
      {
        console.log("Got the JSON file: %O", json);

        // parse the object
        var obj = $.parseJSON(JSON.stringify(json));
        data.tiles.landTiles = obj.landTiles;
        data.tiles.colors = obj.colors;
        data.objects = obj.objects;
        data.tiles.features = obj.features;
        data.tiles.buildings = obj.buildings;
        data.items = obj.items;
        data.actions = obj.actions;
        data.effects = obj.effects;

        data.tiles.tileSet = new Array();
        var tileSet = data.tiles.tileSet;
        addTileArray(tileSet,data.tiles.landTiles);
        addTileArray(tileSet,data.tiles.features);
        addTileArray(tileSet,data.tiles.buildings);

        // link the css file
        $("link[href*='" + data.css + "']").remove();
        data.css = obj.cssfile;
        $('head').append('<link rel="stylesheet" type="text/css" href="' + data.css + '">'); 
        console.log("Using css file: " + data.css);

        // get the font image loaded
        var font = gruecraft.font;
        font.load(obj.fontimage, loadSuccess);
      })
      .fail(function(jqxhr, textstatus, error)
      {
        console.log("Failure! " + JSON.stringify(jqxhr) + 
            " ::: " + textstatus + "," + error);
        console.log("Finished query in " + (new Date().getTime() - startTime) + "ms");
        if (typeof failure !== 'undefined')
        {
          failure();
          return;
        }
      }
    );
  };

  var loadSuccess = function()
  {
    gruecraft.mapModule.createMap();
    gruecraft.screen.init();
    gruecraft.mapModule.createMapSegment();
    gruecraft.screen.printScreen();
    gruecraft.input.checkDiscoveries();

    if (typeof successCallback !== 'undefined')
    {
      successCallback();
    }
  };

  return {
    setStyle: setStyle,
    addClickListeners: addClickListeners,
  };

})();
