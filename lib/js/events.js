var gruecraft = gruecraft || {};

gruecraft.events = (function()
{

  var timeoutMin = 3*1000;
  var timeoutMax = 30*1000;
//  var timeoutMin = 30*1000;
//  var timeoutMax = 300*1000;
  var fireChance = 10;
  var attackChance = 10;
  var decayChance = 50;

  var started = false;

  var nextRand = function()
  {
    return Math.random() * (timeoutMax-timeoutMin) + timeoutMin;
  };

  var init = function()
  {
    if (started)
      return;
    setTimeout(playerRandomness, nextRand());
    for (var pos in gruecraft.gamedata.state.buildings)
    {
      startBaseEventTimer(pos);
    }
    started = true;
  };

  var startBaseEventTimer = function(pos)
  {
    setTimeout( function()
        {
          buildingRandomness(pos);
        }, nextRand());
  }

  // events that occur directly to the player
  var playerRandomness = function()
  {
    var state = gruecraft.gamedata.state;
    // reset timeout if clock is frozen
    if (state.freezeClock)
    {
      setTimeout(playerRandomness, nextRand());
      return;
    }
    setTimeout(playerRandomness, nextRand());

    console.log("Random player event");
  };

  // events that occur at player buildings even when they're not there
  var buildingRandomness = function(pos)
  {
    var state = gruecraft.gamedata.state;
    var items = gruecraft.gamedata.items;
    var map = gruecraft.mapModule;

    var base = gruecraft.gamedata.state.buildings[pos];
    // if it's gone, don't reset the timer
    if (typeof base === 'undefined')
      return;

    // reset timeout if clock is frozen
    if (state.freezeClock)
    {
      setTimeout( function()
          {
            buildingRandomness(pos);
          }, nextRand());
      return;
    }
    setTimeout( function()
        {
          buildingRandomness(pos);
        }, nextRand());

    var atLoc = map.getCurrentPosition() == pos;
    // go through possible effects in the location first
    var effectMap = {};
    for (var i in base.contents)
    {
      if (items.hasOwnProperty(i) && items[i].hasOwnProperty("effects"))
      {
        for (var effect in items[i].effects)
        {
          if (!effectMap.hasOwnProperty(effect))
          {
            effectMap[effect] = 0;
          }
          effectMap[effect] += items[i].effects[effect] * base.contents[i];
        }
      }
    }

    var eventOccurred = false;
    for (var effect in effectMap)
    {
      eventOccurred |= handleEffect(effect,effectMap[effect],base,atLoc);
    }

    if (eventOccurred)
    {
      // check max population
      var maxPop = 0;
      if (effectMap.hasOwnProperty("housing"))
      {
        maxPop = effectMap.housing;
      }
      if (base.population > maxPop)
      {
        base.population = maxPop;
        gruecraft.logger.log("With no room to stay, some villagers have moved on.");
      }
      if (atLoc)
        gruecraft.boxes.updateBase();
      return;
    }

    // decay
    // attack
    // fire
    var rand = Math.random() * 100+0.00000001; // non zero;
    var locDecayChance = decayChance;
    if (!atLoc && base.population == 0)
    {
      var n = 0;
      for (var c in base.contents)
      {
        n += base.contents[c];
      }
      if (n == 0)
        locDecayChance = 100
      else
        locDecayChance = decayChance/n; 
    }
    else
    {
      locDecayChance = 0;
    }

    if (rand < locDecayChance)
    {
      randomDecay(pos);
    }
    else if (rand < locDecayChance+fireChance)
    {
      eventOccurred = randomFire(base, atLoc);
    }
    else if (rand < locDecayChance+fireChance+attackChance)
    {
      eventOccurred = randomAttack(base, atLoc);
    }

    if (eventOccurred)
    {
      // check max population
      var maxPop = 0;
      if (effectMap.hasOwnProperty("housing"))
      {
        maxPop = effectMap.housing;
      }
      if (base.population > maxPop)
      {
        base.population = maxPop;
        gruecraft.logger.log("With no room to stay, some villagers have moved on.");
      }
      if (atLoc)
        gruecraft.boxes.updateBase();
      return;
    }
  };

  // called when moving to a new location. Checks danger levels
  // and provides possible environmental effects
  var locationEvent = function()
  {
    console.log("Random location event");
  };

  var handleEffect = function(effectName, chance, base, atLoc)
  {
    if (!gruecraft.gamedata.effects.hasOwnProperty(effectName))
      return false;

    if (Math.random() * 100 >= chance)
    {
      return false;
    }

    var effect = gruecraft.gamedata.effects[effectName];
    for (var ii = 0; ii < effect.effect.length; ii++)
    {
      var e = effect.effect[ii];
      var amount = Math.round(e.amount + 
        (Math.random()*2 - 1) * e.variance);

      var attrArr = e.attribute.split(".");
      var attr = {};
      if (e.loc == "base")
      {
        attr = base;
      }
      else if (e.loc == "inventory")
      {
        attr = gruecraft.gamedata.state.inventory;
      }
      else if (e.loc == "stores")
      {
        attr = base.stores;
      }

      while (attrArr.length > 1)
      {
        var next = attrArr.shift();
        if (!attr.hasOwnProperty(next))
          attr[next] = {};
        attr = attr[next];
      }
      var last = attrArr[0];
      if (!attr.hasOwnProperty(last))
        attr[last] = 0;
      attr[last] = Math.max(0,attr[last]+amount);
          
      if (atLoc)
        gruecraft.logger.log(effect.message);
    }

    return true;
  };

  var randomDecay = function(pos)
  {
    delete gruecraft.gamedata.state.buildings[pos];
    gruecraft.storage.storeState();
    gruecraft.mapModule.createMap();
    gruecraft.screen.init();
    gruecraft.mapModule.createMapSegment();
    gruecraft.screen.printScreen();
    gruecraft.input.checkDiscoveries();
  };

  var randomFire = function(base,atLoc)
  {
    var burnchance = 0.1;
    var items = gruecraft.gamedata.items;

    var destroyed = false;
    for (var item in base.contents)
    {
      if (items.hasOwnProperty(item) && 
          items[item].hasOwnProperty("noBurn") &&
          items[item].noBurn)
      {
        continue;
      }
      for (var ii = 0; ii < base.contents[item]; ii++)
      {
        if (Math.random() < burnchance)
        {
          // destroyed!
          destroyed = true;
          base.contents[item]--;
        }
      }
    }

    if (atLoc && destroyed)
    {
      gruecraft.logger.log("A fire has broken out, destroying buildings!");
    }

    return destroyed;
  };

  var randomAttack = function(base,atLoc)
  {
    console.log("Random building event Pos(" + base.name + "):Attack");
    if (atLoc)
    {
      // TODO add attack by what details
      gruecraft.logger.log("Attack! (add by what)");
    }

    return true;
  };

  return {
    init: init,
    locationEvent: locationEvent,
    startBaseEventTimer: startBaseEventTimer
  };
})();
