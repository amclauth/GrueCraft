<?php include("lib/php/head.html"); ?>
<?php include("lib/php/nav.php"); ?>

  <div class="top-buffer">
    <div class="row">
      <div id="buttons" class="col-sm-12">
      </div>
    </div>
    <div class="row">
      <div id="graph" class="col-sm-12">
      <center>
        <canvas id="viewport" width="800" height="600"></canvas>
      </center>
      </div>
    </div>
  </div>

  <?php include("lib/php/foot.html");?>
  <?php include("lib/php/end.html");?>
  <script src="lib/js/ext/arbor.js"></script>
  <script src="lib/js/tech.js"></script>
  <script language="javascript">
    var tech = gruecraft.techtree;

    $(document).ready(function()
    {
      tech.getJSON("tiles",loaded);
    });

    var loaded = function(data)
    {
      var sys = tech.createMap(data);
      $("#buttons").append(function()
          {
            return $("<a href='#' class='btn btn-primary'>" + 
            "Full</a>")
            .click(function() { tech.createNodes(data,sys); });
          });
      $("#buttons").append(function()
          {
            return $("<a href='#' class='btn btn-primary'>" + 
            "All Locations</a>")
            .click(function() { tech.createLocationNodes(data,sys); })
          });
      var locations = tech.getLocations(data);
      for (var ii = 0; ii < locations.length; ii++)
      {
        var loc = locations[ii];
        $("#buttons").append(function()
            {
              return $("<a href='#' class='btn btn-primary'>" + 
              loc + "</a>")
              .click(buttonFactory(data,sys,loc));
            });
      }
    }

    function buttonFactory(data,sys,loc) {
      return function()
      {
        tech.createLocationNodes(data,sys,loc);
      };
    }


  </script>
     
  </body>
</html>
