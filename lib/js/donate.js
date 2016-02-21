var gruecraft = gruecraft || {};

gruecraft.donate = (function()
{
  var 
      width,
      height,
      canvas,
      context2d;

  var fgColor = "#5555ff";
  var sideColor = "#3333bb";
  var topColor = "#9999ff";
  var border = "#000000";

  var gfgColor = "#55ff55";
  var gsideColor = "#33bb33";
  var gtopColor = "#99ff99";

  var init = function()
  {
    var element = $("#meter");
    canvas = $("#meterCanvas")[0];
    context2d = canvas.getContext("2d");
    if (!context2d)
    {
      console.log("No 2D context");
      return;
    }

    canvas.width = element.width();
    canvas.height = 300;
    width = canvas.width;
    height = canvas.height;
  };

  var animate = function(amt1,amt2)
  {
    if (amt2 > height)
      amt2 = height;
    var current = amt1;
    var ticAmt = Math.round((amt2-amt1) / 2/ 1000 * 50);
    if (ticAmt < 1)
      ticAmt = 1;
    var max = amt2;
    var pid = setInterval(function()
    {
      draw(current);
      // over 2 seconds at 50ms intervals
      current += ticAmt;
      if (current > amt2)
        window.clearInterval(pid);
    },50);
  };

  var draw = function(amt)
  {
    if (amt > height)
      amt = height;
    context2d.clearRect(0,0,width,height);
    var c = context2d;

    var base = Math.floor(height - height*0.1);
    var left = Math.floor(width * 0.35);
    var right = Math.floor(width * 0.85);
    var top = Math.floor(base - amt);

    var backBase = base - 20;
    var backLeft = left + 20;
    var backRight = right + 20;
    var backTop = top - 20;

    // main face
    c.beginPath();
    c.moveTo(left,base);
    c.lineTo(right,base);
    c.lineTo(right,top);
    c.lineTo(left,top);
    c.closePath();

    c.lineWidth=0;
    c.strokeStyle=border;
    c.stroke();

    c.fillStyle= amt >= 100 ? gfgColor : fgColor;
    c.fill();

    // right face
    c.beginPath();
    c.moveTo(right,base);
    c.lineTo(backRight,backBase);
    c.lineTo(backRight,backTop);
    c.lineTo(right,top);
    c.closePath();

    c.lineWidth=0;
    c.strokeStyle=border;
    c.stroke();

    c.fillStyle= amt >= 100 ? gsideColor : sideColor;
    c.fill();

    // top face
    c.beginPath();
    c.moveTo(right,top);
    c.lineTo(backRight,backTop);
    c.lineTo(backLeft,backTop);
    c.lineTo(left,top);
    c.closePath();

    c.lineWidth=0;
    c.strokeStyle=border;
    c.stroke();

    c.fillStyle= amt >= 100 ? gtopColor : topColor;
    c.fill();

    for (var ii = 0; ii <= 200; ii+=50)
    {
      addTic(ii,left,base);
    }
  };

  var addTic = function(level,left,base)
  {
    // let the font color bleed
    var c = context2d;
    c.beginPath();
    c.moveTo(left-10,base - level);
    c.lineTo(left-20,base - level);
    c.closePath();
    c.strokeStyle="#ffffff";
    c.stroke();
    c.font = "14px Arial";
    c.fillText("$" + level,left-60,base+5 - level);
  };

  return {
    init: init,
    draw: draw,
    animate: animate
  };
})();
