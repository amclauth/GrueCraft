<?php include("lib/php/head.html"); ?>
<?php include("lib/php/nav.php"); ?>

  <div class="top-buffer">
    <div class="row">
      <div id="control" class="col-sm-12">
        <form class="form-horizontal" role="form" id="mapform">
          <div class="form-group row col-md-12">
            <label for="seed" class="col-sm-4 col-md-2 control-label">Seed</label>
            <div class="col-sm-8 col-md-3">
              <input type="number" min="0" step="1" class="form-control" id="seed" name="seed" placeholder="42" value="42" required>
            </div>
            <div class="form-group col-sm-12 col-md-2">
              <input id="mapsubmit" name="mapsubmit" type="submit" value="Gen Map" class="btn btn-primary">
            </div>
          </div>
        </form>
        <div id="map" class="col-sm-12 map large-map">
          <canvas id="mapCanvas" width="0" height="0"></canvas>
        </div>
      </div>
    </div>
  </div>

  <?php include("lib/php/foot.html");?>
  <?php include("lib/php/end.html");?>
  <script language="javascript">
    var log = gruecraft.logger.log;
    var data = gruecraft.gamedata;
    var storage = gruecraft.storage;
    var style = gruecraft.style;
    var input = gruecraft.input;
    var map = gruecraft.mapModule;
    var timer = gruecraft.timer;
    var screen = gruecraft.screen;
    var startTime;

    $(document).ready(function()
    {
      $("#mapform").on('submit', function(e)
        {
          mapGen();
          return false;
        });

      data.init();
      storage.getState();
      style.addClickListeners(loaded);
      mapGen();
    });

    var loaded = function()
    {
      data.transients.daylight = 1;
      data.transients.screenRadiusX = 100;
      data.transients.screenRadiusY = 100;
      data.state.xLoc = 0;
      data.state.yLoc = 0;
      screen.init();
      map.createMapSegment();
      screen.printScreen();
      console.log("Map drawn in " + (new Date().getTime() - startTime) + "ms");
    }

    function mapGen()
    {
      startTime = new Date().getTime();
      var seed = Number($("#seed").val());
      data.state.maps[data.state.currentMap].seed = seed;
      style.setStyle(data.state.style, loaded);
    }

  </script>
     
  </body>
</html>
