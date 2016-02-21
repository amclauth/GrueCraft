var gruecraft = gruecraft || {};

gruecraft.font = (function()
{
  var fontData = {};
  /*
   // data from data.json //
   "src":"lib/styles/tiles/ultima.png",
   "charsWide":32,
   "charsHigh":16,
   "charWidth":32,
   "charHeight":32,
   "displayedCharWidth":16,
   "displayedCharHeight":16,
   "tilesOnly":true
  */

  var load = function(fontSrcData, success)
  {
    for (var key in fontSrcData)
    {
      fontData[key] = fontSrcData[key];
    }
    fontData.image = new Image();
    console.log("Using font file: " + fontData.src);
    gruecraft.gamedata.transients.screenRadiusX = 
      Math.floor(30*8/fontData.displayedCharWidth);
    gruecraft.gamedata.transients.screenRadiusY = 
      Math.floor(15*12/fontData.displayedCharHeight);

    fontData.image.onload = success;
    fontData.image.src = fontData.src;
  };

  return {
    load:load,
    data:fontData
  };

})();
