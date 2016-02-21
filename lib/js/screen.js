var gruecraft = gruecraft || {};

gruecraft.screen = (function()
{
  var xMax,
      yMax,
      charsWide,
      charsHigh,

      charBuffer,
      fgColorBuffer,
      bgColorBuffer,
      alphaBuffer,

      fontImage,
      coloredFonts,

      canvas,
      context2d;

  var getWidth = function()
  {
    return canvas.width;
  };

  var getHeight = function()
  {
    return canvas.height;
  };

  var init = function()
  {
    canvas = $("#mapCanvas")[0];
    context2d = canvas.getContext("2d");
    if (!context2d)
    {
      console.log("No 2D context");
      return;
    }

    var data = gruecraft.gamedata;
    var font = gruecraft.font.data;

    var screenWidth = $("#map").width();
    var screenHeight = $("#map").height();
    xMax = Math.floor((Math.floor(screenWidth / font.displayedCharWidth) - 1) / 2);
    yMax = Math.floor((Math.floor(screenHeight / font.displayedCharHeight) - 1) / 2);

    if (data.transients.screenRadiusX < xMax || xMax > 12)
    {
      data.transients.screenRadiusX = xMax;
    }
    else
    {
      xMax = data.transients.screenRadiusX;
    }
    if (data.transients.screenRadiusY < yMax || yMax > 12)
    {
      data.transients.screenRadiusY = yMax;
    }
    else
    {
      yMax = data.transients.screenRadiusY;
    }

    charsWide = xMax * 2 + 1;
    charsHigh = yMax * 2 + 1;
    canvas.width = charsWide * font.displayedCharWidth;
    canvas.height = charsHigh * font.displayedCharHeight;

    charBuffer = new Uint16Array(charsWide * charsHigh);
    fgColorBuffer = new Uint8Array(charsWide * charsHigh);
    bgColorBuffer = new Uint8Array(charsWide * charsHigh);
/*    for (var ii = 0; ii < charsWide * charsHigh; ii++)
    {
      fgColorBuffer[ii] = 255;
      bgColorBuffer[ii] = 255;
    }*/
    alphaBuffer = new Uint8Array(charsWide * charsHigh);

    if (font.tilesOnly)
    {
      fontImage = document.createElement('canvas');
      fontImage.width = font.image.width;
      fontImage.height = font.image.height;
      var bufferContext = fontImage.getContext('2d');
      bufferContext.drawImage(font.image,0,0);
    }
    else
    {
      var colorLength = data.tiles.colors.length;
      coloredFonts = new Array(colorLength);
      for (var ii = 0; ii < colorLength; ii++)
      {
        coloredFonts[ii] = document.createElement('canvas');
        coloredFonts[ii].width = font.image.width;
        coloredFonts[ii].height = font.image.height;
        var bufferContext = coloredFonts[ii].getContext('2d');
        bufferContext.fillStyle = data.tiles.colors[ii];
        bufferContext.fillRect(0,0,font.image.width, font.image.height);
        bufferContext.globalCompositeOperation = "destination-atop";
        bufferContext.drawImage(font.image,0,0);
      }
    }

    addTileMapping(data.tiles.tileSet);
  };

  var addTileMapping = function(list)
  {
    var font = gruecraft.font.data;
    var data = gruecraft.gamedata;
    var tilesOnly = font.tilesOnly;
    for (var ii = 0; ii < list.length; ii++)
    {
      var charId = list[ii].tile;
      var cx = (charId % font.charsWide) * font.charWidth;
      var cy = Math.floor(charId / font.charsWide) * font.charHeight;
      var legend = document.createElement('canvas');
      legend.width = font.displayedCharWidth;
      legend.height = font.displayedCharHeight;
      var bufferContext = legend.getContext('2d');
      if (tilesOnly)
      {
        bufferContext.drawImage(fontImage,
            cx,cy,font.charWidth,font.charHeight,0,0,
            font.displayedCharWidth,font.displayedCharHeight);
      }
      else
      {
        bufferContext.fillStyle = data.tiles.colors[list[ii].bgColorIdx];
        bufferContext.fillRect(0,0,font.displayedCharWidth,font.displayedCharHeight);
        bufferContext.drawImage(coloredFonts[list[ii].fgColorIdx],
            cx,cy,font.charWidth,font.charHeight,0,0,
            font.displayedCharWidth,font.displayedCharHeight);
      }
      list[ii].dataURL = legend.toDataURL();
    }
  };

  var setTile = function(x,y,n,a,fg,bg)
  {
    var _x = x + xMax - data.state.xLoc;
    var _y = -y + yMax + data.state.yLoc;
    var writePos = _x + _y * charsWide;
    setTileWritePos(writePos,n,a,fg,bg);
  }

  var setTileNormal = function(x,y,n,a,fg,bg)
  {
    var writePos = x + y * charsWide;
    setTileWritePos(writePos,n,a,fg,bg);
  };

  var setTileWritePos = function(writePos,n,a,fg,bg)
  {
    charBuffer[writePos] = n;
    if (typeof fg === 'undefined')
    {
      fgColorBuffer[writePos] = 255;
    }
    else
    {
      fgColorBuffer[writePos] = fg;
    }

    if (typeof bg === 'undefined')
    {
      bgColorBuffer[writePos] = 255;
    }
    else
    {
      bgColorBuffer[writePos] = bg;
    }

    alphaBuffer[writePos] = Math.floor(a*255);
  };

  var setNumberedCharNormal = function(x,y,n,fg,bg,a)
  {
    var writePos = x + y * charsWide;
    charBuffer[writePos] = n;
    fgColorBuffer[writePos] = fg;
    bgColorBuffer[writePos] = bg;
    alphaBuffer[writePos] = Math.floor(a*255);
  };

  var printScreen = function()
  {
    var font = gruecraft.font.data;
    var data = gruecraft.gamedata;
    var readPos = 0;
    var sy = 0;
    context2d.clearRect(0,0,canvas.width,canvas.height);
    for (var y = 0; y < charsHigh; y++)
    {
      var sx = 0;
      for (var x = 0; x < charsWide; x++)
      {
        var charId = charBuffer[readPos];
        var _fg = fgColorBuffer[readPos];
        var _bg = bgColorBuffer[readPos];
        var a = alphaBuffer[readPos] / 255.0;

        var cx = (charId % font.charsWide) * font.charWidth;
        var cy = Math.floor(charId / font.charsWide) * font.charHeight;

        context2d.globalAlpha = alphaBuffer[readPos] / 255.0;
//        if (typeof bgColorBuffer !== 'undefined' && bgColorBuffer[readPos] < 255)
        if (bgColorBuffer[readPos] < 255)
        {
          context2d.fillStyle = data.tiles.colors[bgColorBuffer[readPos]];
          context2d.fillRect(sx,sy,font.displayedCharWidth,font.displayedCharHeight);
        }
//        if (typeof fgColorBuffer !== 'undefined' && typeof coloredFonts !== 'undefined' && fgColorBuffer[readPos] < 255)
        if (fgColorBuffer[readPos] < 255)
        {
          context2d.drawImage(coloredFonts[fgColorBuffer[readPos]],
              cx,cy,font.charWidth,font.charHeight,sx,sy,
              font.displayedCharWidth,font.displayedCharHeight);
        }
        else
        {
          context2d.drawImage(font.image,
              cx,cy,font.charWidth,font.charHeight,sx,sy,
              font.displayedCharWidth,font.displayedCharHeight);
        }

        readPos++;
        sx += font.displayedCharWidth;
      }
      sy += font.displayedCharHeight;
    }
  }

  return {
    init: init,
    printScreen: printScreen,
    setTile: setTile,
    getWidth: getWidth,
    getHeight: getHeight
  };
})();
