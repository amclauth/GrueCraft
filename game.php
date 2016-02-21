<?php include("lib/php/head.html"); ?>
<?php include("lib/php/nav.php"); ?>

  <div class="top-buffer">
    <div class="row">

      <div class="col-md-7 col-md-push-3">
        <div class="col-md-4 col-md-offset-4"><a href="#" class="btn btn-primary col-md-12" id="swapButton">Travel</a></div>
        <div id="control" class="col-sm-12 hidden top-buffer">
        </div>
        <div id="map_pane" class="col-md-12 top-buffer">
          <div id="map" class="col-sm-12 map">
            <canvas id="mapCanvas" width="0" height="0"></canvas>
          </div>
        </div>
      </div>

      <div id="boxes" class="col-md-2 col-md-push-3">
        <div id="inventory" class="title_box">
          <div class="tbtitle">Inventory</div>
          <div class="tbcontent" id="inventoryContent">
          </div>
        </div>
        <div id="stores" class="title_box">
          <div class="tbtitle">Stores</div>
          <div class="tbcontent" id="storesContent">
          </div>
        </div>
        <div id="base" class="title_box">
          <div class="tbtitle" id="baseTitle">Village</div>
          <div class="tbcontent" id="baseContent">
          </div>
        </div>
        <div id="resources" class="title_box">
          <div class="tbtitle">Resources</div>
          <div class="tbcontent" id="resourcesContent">
          </div>
        </div>
        <div id="legend" class="title_box hidden">
          <div class="tbtitle">Legend</div>
          <div class="tbcontent" id="legendContent">
          </div>
        </div>
      </div>

      <div id="log" class="col-md-3 col-md-pull-9">
      </div>
    </div>
  </div>

  <?php include("lib/php/foot.php");?>
  <?php include("lib/php/end.html");?>

  <script language="javascript">
    var log = gruecraft.logger.log;
    var data = gruecraft.gamedata;
    var storage = gruecraft.storage;
    var style = gruecraft.style;
    var input = gruecraft.input;
    var map = gruecraft.mapModule;
    var timer = gruecraft.timer;
    var control = gruecraft.control;
    var boxes = gruecraft.boxes;
    var events = gruecraft.events;

    $(document).ready(function()
    {
      data.init();
      storage.getState();
      style.setStyle(data.state.style, loaded);
    });

    function loaded()
    {
      input.checkDiscoveries();
      input.checkResources();
      control.initPane();
      boxes.updateLegend();
      boxes.updateInventory();
      style.addClickListeners(styleLoaded);
      $(document).keydown(function (e) { input.onKeyDown(e); });
      timer.startTimers();
      events.init();
      timer.printDayCycle();
    };

    function styleLoaded()
    {
      storage.storeState();
      boxes.updateLegend();
    }
  </script>

  </body>
</html>
