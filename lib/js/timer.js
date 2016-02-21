var gruecraft = gruecraft || {};

gruecraft.timer = (function()
{
  var timerPID;
  var gloom = 0.25;
  var gloaming = 0.6;

  var startTimers = function()
  {
    console.log("The timer has started");

    checkDayCycle();
    timerPID = setInterval(function()
    {
      checkDayCycle();
    }, data.transients.clickTime*1000);
  };

  var stopTimers = function()
  {
    clearInterval(timerPID);
  };

  var printDayCycle = function()
  {
    var state = gruecraft.gamedata.state;
    var logroll = gruecraft.logger.log;
    if (state.freezeClock)
    {
      return;
    }
    switch(state.dayCycle)
    {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        logroll("It is daytime.");
        break;
      case 8:
        logroll("The skies grow darker. Night is coming.");
        break;
      case 9:
        logroll("The sun has almost set.");
        break;
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        logroll("It is nighttime.");
        break;
      case 18:
        logroll("The sun begins to peek over the horizon.");
        break;
      case 19: 
        logroll("The sun is almost risen.");
        break;
    }
  };

  checkDayCycle = function()
  {
    var data = gruecraft.gamedata;
    var state = data.state;
    var trans = data.transients;
    var logroll = gruecraft.logger.log;

    if (state.freezeClock)
    {
      return;
    }
    state.dayCycle++;
    if (state.dayCycle >= 20)
    {
      state.dayCycle = 0;
      state.score.age++;
      // Metric years. What?
      if (state.score.age % 100 == 0)
      {
        logroll("It's your birthday!");
      }
    }
    gruecraft.storage.storeState();

    switch(state.dayCycle)
    {
      case 0:
        printDayCycle();
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        trans.daylight = 1;
        break;
      case 8:
        printDayCycle();
        trans.daylight = gloaming;
        break;
      case 9:
        printDayCycle();
        trans.daylight = gloom;
        break;
      case 10:
        printDayCycle();
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        trans.daylight = 0;
        break;
      case 18:
        printDayCycle();
        trans.daylight = gloom;
        break;
      case 19:
        printDayCycle();
        trans.daylight = gloaming;
        break;
    }

    gruecraft.mapModule.createMapSegment();
    gruecraft.screen.printScreen();
  }

  return {
    startTimers: startTimers,
    stopTimers: stopTimers,
    printDayCycle: printDayCycle,
    checkDayCycle: checkDayCycle
  };

})();

