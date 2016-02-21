var gruecraft = gruecraft || {};

gruecraft.techtree = (function()
{
  var getJSON = function(name,success)
  {
    $.getJSON("lib/styles/" + name + "/data.json", function()
      {
        console.log("Sent query for " + name + "/data.json");
      })
      .done(function(json)
      {
        console.log("Got the JSON file: %O", json);

        var obj = $.parseJSON(JSON.stringify(json));
        success(obj);
      })
      .fail(function(jqxhr, textstatus, error)
      {
        console.log("Failure! " + JSON.stringify(jqxhr) +
              " ::: " + textstatus + "," + error);
      });
  }

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem

    var that = {
      init:function(system){
        particleSystem = system

        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
        
        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },
      
      redraw:function(){
        ctx.fillStyle = "black"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){

          if (typeof edge.data.hidden === 'undefined' || !edge.data.hidden)
          {
            // draw a line from pt1 to pt2
            ctx.strokeStyle = "#cccccc"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(pt1.x, pt1.y)
            ctx.lineTo(pt2.x, pt2.y)
            ctx.stroke()
          }

          if (typeof edge.data.directed === 'undefined' || edge.data.directed)
          {
            ctx.save()
              // move to the head position of the edge we just drew
              var wt = 2;
              var arrowLength = 6 + wt
              var arrowWidth = 2 + wt
              ctx.fillStyle = "#cccccc"
              ctx.translate(pt2.x, pt2.y);
              ctx.rotate(Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x));

              // delete some of the edge that's already there (so the point isn't hidden)
              ctx.clearRect(-arrowLength/2,-wt/2, arrowLength/2,wt)

              // draw the chevron
              ctx.beginPath();
              ctx.moveTo(-arrowLength, arrowWidth);
              ctx.lineTo(0, 0);
              ctx.lineTo(-arrowLength, -arrowWidth);
              ctx.lineTo(-arrowLength * 0.8, -0);
              ctx.closePath();
              ctx.fill();
            ctx.restore()
          }
        }
      );

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10
          ctx.fillStyle = node.data.color;
          ctx.font = "14px Arial";
          ctx.textAlign="center";
          if (typeof node.data.type !== 'undefined' &&
            node.data.type == "main")
          {
            ctx.fillText(node.data.name,pt.x,pt.y);
          }
          else
          {
            ctx.fillText(node.data.name,pt.x,pt.y+20);
          }
        })          
      },
      
      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }
        
        // start listening
        $(canvas).mousedown(handler.clicked);

      },
      
    }
    return that
  }    

  var massageData = function(data)
  {
    for (var action in data.actions)
    {
      if (data.actions[action].requires.hasOwnProperty("loc") &&
          data.actions[action].requires.loc.length == 0)
      {
        data.actions[action].requires.loc = ["None"];
      }
    }
  };

  var getResources = function(data)
  {
    var resources = [];
    for (var action in data.actions)
    {
      if (data.actions[action].hasOwnProperty("requires") &&
          data.actions[action].requires.hasOwnProperty("resources"))
      {
        var l = data.actions[action].requires.resources;
        for (var ii = 0; ii < l.length; ii++)
        {
          if ($.inArray(l[ii],resources) == -1)
          {
            resources.push(l[ii]);
          }
        }
      }
    }
    return resources;
  };

  var getLocations = function(data)
  {
    var locations = [];
    for (var action in data.actions)
    {
      if (data.actions[action].hasOwnProperty("requires") &&
          data.actions[action].requires.hasOwnProperty("loc"))
      {
        var l = data.actions[action].requires.loc;
        for (var ii = 0; ii < l.length; ii++)
        {
          if ($.inArray(l[ii],locations) == -1)
          {
            locations.push(l[ii]);
          }
        }
      }
      if (data.actions[action].hasOwnProperty("produces") &&
          data.actions[action].produces.hasOwnProperty("loc"))
      {
        var l = data.actions[action].produces.loc;
        if ($.inArray(l,locations) == -1)
        {
          locations.push(l);
        }
      }
    }
    return locations;
  };

  var getProducts = function(data)
  {
    var products = [];
    for (var action in data.actions)
    {
      if (data.actions[action].hasOwnProperty("requires"))
      {
        var l = data.actions[action].requires;
        for (var loc in l)
        {
          if (loc == "loc" || loc == "resources")
            continue;
          for (var prod in l[loc])
          {
            if ($.inArray(l[loc][prod],products) == -1)
            {
              products.push(l[loc][prod]);
            }
          }
        }
      }
      if (data.actions[action].hasOwnProperty("produces"))
      {
        var l = data.actions[action].produces;
        for (var loc in l)
        {
          if (loc == "loc" || loc == "resources")
            continue;
          for (var prod in l[loc])
          {
            if ($.inArray(l[loc][prod],products) == -1)
            {
              products.push(l[loc][prod]);
            }
          }
        }
      }
    }
    return products;
  };

  var createNodesByLocation = function(data,sys)
  {
    var locations = getLocations(data);
    for (var ii = 0; ii < locations.length; ii++)
    {
      createNodeClusterForLocation(locations[ii],locations,data,sys);
    }
  };

  var createNodeClusterForLocation = function(location,locations,data,sys)
  {
    sys.addNode(location, {name:location, color: "#ff5555", "type":"main"});
    for (var action in data.actions)
    {
      // check location
      var locs = locations;
      if (data.actions[action].hasOwnProperty("requires"))
      {
        var r = data.actions[action].requires;
        if (r.hasOwnProperty("loc"))
        {
          locs = r.loc;
        }
        if ($.inArray(location,locs) == -1)
        {
          continue;
        }
      }
      // set node color for outbound node
      var color = "#55ff55";
      if (data.actions[action].hasOwnProperty("produces") &&
          data.actions[action].produces.hasOwnProperty("loc") &&
          data.actions[action].produces.loc != location)
      {
        color = "#ffaa00";
      }
      // add resource nodes
      if (data.actions[action].hasOwnProperty("requires") &&
          data.actions[action].requires.hasOwnProperty("resources"))
      {
        var r = data.actions[action].requires.resources;
        for (var ii = 0; ii < r.length; ii++)
        {
          if (typeof sys.getNode(location+r[ii]) === 'undefined')
          {
            sys.addNode(location+r[ii], {name: r[ii], color: "#cccccc"});
          }
          if (typeof sys.getNode(location+action) === 'undefined')
          {
            sys.addNode(location+action, {name:action, color: color});
            sys.addEdge(location,location+action,{length:3,"hidden":true,"directed":false});
          }
          sys.addEdge(location+r[ii],location+action);
        }
      }

      // handle other requires (non loc, non resources)
      if (data.actions[action].hasOwnProperty("requires"))
      {
        var r = data.actions[action].requires
        for (var loc in r)
        {
          if (loc == "loc" || loc == "resources")
          {
            continue;
          }
          for (var res in r[loc])
          {
            if (typeof sys.getNode(location+loc+res) === 'undefined')
            {
              var name = loc.substring(0,2)+":"+res;
              sys.addNode(location+loc+res, {name: name, color:"#5555ff"});
            }
            if (typeof sys.getNode(location+action) == 'undefined')
            {
              sys.addNode(location+action, {name:action, color: color});
              sys.addEdge(location,location+action,{length:3,"hidden":true,"directed":false});
            }
            sys.addEdge(location+loc+res,location+action);
          }
        }
      }

      // handle produces (non loc)
      if (data.actions[action].hasOwnProperty("produces"))
      {
        var r = data.actions[action].produces
        for (var loc in r)
        {
          if (loc == "loc")
          {
            continue;
          }
          for (var res in r[loc])
          {
            if (typeof sys.getNode(location+loc+res) === 'undefined')
            {
              var name = loc.substring(0,2)+":"+res;
              sys.addNode(location+loc+res, {name: name, color:"#5555ff"});
            }
            if (typeof sys.getNode(location+action) === 'undefined')
            {
              sys.addNode(location+action, {name:action, color: color});
              sys.addEdge(location,location+action,{length:3,"hidden":true,"directed":false});
            }
            sys.addEdge(location+action,location+loc+res);
          }
        }
      }
    }
  };

  var createFullNodes = function(data,sys)
  {
    var locations = getLocations(data);
    var resources = getResources(data);
    // handle resources in actions
    for (var action in data.actions)
    {
      var color = "#55ff55";
      if (data.actions[action].hasOwnProperty("produces") &&
          data.actions[action].produces.hasOwnProperty("loc") &&
          data.actions[action].produces.loc != location)
      {
        color = "#ffaa00";
      }
      if (data.actions[action].hasOwnProperty("requires") &&
          data.actions[action].requires.hasOwnProperty("resources"))
      {
        var r = data.actions[action].requires.resources;
        var locs = locations;
        if (data.actions[action].requires.hasOwnProperty("loc"))
        {
          locs = data.actions[action].requires.loc;
        }
        for (var ii = 0; ii < r.length; ii++)
        {
          if (locs.length == locations.length)
          {
            if (typeof sys.getNode(r[ii]) === 'undefined')
            {
              sys.addNode(r[ii], {name: r[ii], color: "#cccccc"});
            }
            if (typeof sys.getNode(action) === 'undefined')
            {
              sys.addNode(action, {name:action, color: color});
            }
            sys.addEdge(r[ii],action);
          }
          else
          {
            for (var jj = 0; jj < locs.length; jj++)
            {
              if (typeof sys.getNode(locs[jj] + r[ii]) === 'undefined')
              {
                var name = locs[jj].substring(0,1) + ":" + r[ii];
                sys.addNode(locs[jj]+r[ii], {name: name, color: "#cccccc"});
              }
              sys.addNode(locs[jj]+action, {name:action, color: color});
              sys.addEdge(locs[jj]+r[ii],locs[jj]+action);
            }
          }
        }
      }
    }
    // handle other requires (non loc, non resources)
    for (var action in data.actions)
    {
      var color = "#55ff55";
      if (data.actions[action].hasOwnProperty("produces") &&
          data.actions[action].produces.hasOwnProperty("loc") &&
          data.actions[action].produces.loc != location)
      {
        color = "#ffaa00";
      }
      if (data.actions[action].hasOwnProperty("requires"))
      {
        var r = data.actions[action].requires
        var locs = locations;
        if (r.hasOwnProperty("loc"))
        {
          locs = r.loc;
        }
        for (var loc in r)
        {
          if (loc == "loc" || loc == "resources")
          {
            continue;
          }
          if (locs.length == locations.length)
          {
            for (var res in r[loc])
            {
              if (typeof sys.getNode(loc+res) === 'undefined')
              {
                var name = loc.substring(0,2)+":"+res;
                sys.addNode(loc+res, {name: name, color:"#5555ff"});
              }
              if (typeof sys.getNode(action) == 'undefined')
              {
                sys.addNode(action, {name:action, color: color});
              }
              sys.addEdge(loc+res,action);
            }
          }
          else
          {
            for (var jj = 0; jj < locs.length; jj++)
            {
              for (var res in r[loc])
              {
                if (typeof sys.getNode(loc+res) === 'undefined')
                {
                  var name = loc.substring(0,2)+":"+res;
                  sys.addNode(loc+res, {name: name, color:"#5555ff"});
                }
                if (typeof sys.getNode(locs[jj]+action) == 'undefined')
                {
                  sys.addNode(locs[jj]+action, {name:action, color: color});
                }
                sys.addEdge(loc+res,locs[jj]+action);
              }
            }
          }
        }
      }
    }
    // handle produces (non loc)
    for (var action in data.actions)
    {
      var color = "#55ff55";
      if (data.actions[action].hasOwnProperty("produces") &&
          data.actions[action].produces.hasOwnProperty("loc") &&
          data.actions[action].produces.loc != location)
      {
        color = "#ffaa00";
      }
      if (data.actions[action].hasOwnProperty("produces"))
      {
        var r = data.actions[action].produces
        var locs = locations;
        if (data.actions[action].requires.hasOwnProperty("loc"))
        {
          locs = data.actions[action].requires.loc;
        }
        for (var loc in r)
        {
          if (loc == "loc")
          {
            continue;
          }
          for (var res in r[loc])
          {
            if (locs.length == locations.length)
            {
              if (typeof sys.getNode(loc+res) === 'undefined')
              {
                var name = loc.substring(0,2)+":"+res;
                sys.addNode(loc+res, {name: name, color:"#5555ff"});
              }
              if (typeof sys.getNode(action) === 'undefined')
              {
                sys.addNode(action, {name:action, color: color});
              }
              sys.addEdge(action,loc+res);
            }
            else
            {
              for (var jj = 0; jj < locs.length; jj++)
              {
                if (typeof sys.getNode(loc+res) === 'undefined')
                {
                  var name = loc.substring(0,2)+":"+res;
                  sys.addNode(loc+res, {name: name, color:"#5555ff"});
                }
                if (typeof sys.getNode(locs[jj]+action) == 'undefined')
                {
                  sys.addNode(locs[jj]+action, {name:action, color: color});
                }
                sys.addEdge(locs[jj]+action,loc+res);
              }
            }
          }
        }
      }
    }

  };

  var createNodes = function(data,sys)
  {
    sys.prune(function(node, from, to)
        {
        return true;
        });
    createFullNodes(data,sys);
  };

  var createLocationNodes = function(data,sys,location)
  {
    sys.prune(function(node, from, to)
        {
        return true;
        });
    if (typeof location === 'undefined')
    {
      var nodes = createNodesByLocation(data,sys);
    }
    else if (location == "")
    {
      createNodeClusterForLocation("None",getLocations(data),data,sys);
    }
    else
    {
      console.log(location);
      createNodeClusterForLocation(location,getLocations(data),data,sys);
    }
  };


  var createMap = function(data)
  {
    var sys = arbor.ParticleSystem(2000, 500, 0.5) // create the system with sensible repulsion/stiffness/friction
    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...
    massageData(data);
    return sys;
  };

  return {
    createMap: createMap, 
    createNodes: createNodes,
    createLocationNodes: createLocationNodes,
    getJSON: getJSON,
    getLocations: getLocations
  };
})();

