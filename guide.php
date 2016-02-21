<?php include("lib/php/head.html");?>
<?php include("lib/php/nav.php");?>

  <div class="top-buffer col-md-10 col-md-offset-1">
      <div>
        <h1 class="text-primary">GrueCraft</h1>
        <a href="#play">How to Play</a><br>
        <a href="#skin">Skin the game</a><br>
      </div>
      <div>
        <a name="#play"></a>
        <p class="lead text-warning">How to play</p>
        <div class="col-md-offset-1">
          <h2>General Guide</h2>
          <p>This is a game of resource management, survival, building, and chance encounters. You need to build up areas for people to gather and keep them safe so they can create items to help you conquer the map.</p>
          <p>Your first job will be simply surviving and attracting people to your side. Then you will work on expanding your influence through your own exploration and building an army. Eventually, you will be able to tackle the most difficult challenges the world has to throw at you and may ascend to new heights and challenges.</p>
          <a href="#" class="spoiler">Show Walkthrough</a>

          <div class="panel panel-primary spoiler">
            <div class="panel-heading">
              <h2>Walkthrough 
              <a href="#" class="walkthrough-next">(next)</a></h2>
            </div>
            <div class="panel-body">
              <p>This section is hidden to prevent too many "spoilers". To view the guide, you should expand each section with the "next section" link until you've reached the level of the game that you're at. It's up to you if you want to see everything, or keep things a surprise until you work your way through it.<p>
              <p>Note: Because this game contains a lot of randomly generated elements, no guide will be able to give explicit information such as, "Go eight tiles to the left and enter the dungeon there." Instead, some exploration, lots of planning, and some luck will be involved in progressing through the game.</p>
            </div>
          </div>

          <div class="panel panel-primary spoiler">
            <div class="panel-heading">
              <h2>
                <a href="#" class="walkthrough-prev">(prev)</a> 
                Starting Out 
                <a href="#" class="walkthrough-next">(next)</a></h2>
            </div>
            <div class="panel-body">
              <p>Starting the game, you are vulnerable to the danger of the world. Your first task should be to find a suitable location to develop. Take note that the further you get from where you started, the more dangerous the land becomes, so you may not want to wander too far initially!</p>
              <p>All you can do in this state is gather branches. If you encounter dangerous creatures, you can only use the "punch" ability to fight them or you can attempt to flee. You're pretty weak!</p>
              <p>Let's go over some of the game mechanics, since you're looking at this section for a reason!</p>
              <p>You started out on the map screen. On the right side of the screen (below the screen in a small browser), you'll see some boxes that list your <u>Inventory</u> and <u>Resources</u>. Your Inventory is what you're currently carrying. You have a fairly limited carrying capacity by yourself. The resources box shows you what resources you can get from the tiles around you (two tiles in any direction). This is helpful for deciding where to start building a base generally, but not so important initially. The main resource you'll need just to get started are "wood", "meat", and "water".</p>
              <p>To the left, there is a log that tracks where you are and what's happening. You should check that when it scrolls as something around you is changing! That could be as simple as a transition from day to night, or it could be news of something important happening nearby (something to run away from or towards!).</p>
            </div>
          </div>

          <div class="panel panel-primary spoiler">
            <div class="panel-heading">
              <h2>
                <a href="#" class="walkthrough-prev">(prev)</a> 
                Campsite 
<!--                <a href="#" class="walkthrough-next">(next)</a></h2>-->
            </div>
            <div class="panel-body">
              <p>Some more info</p>
            </div>
          </div>


        </div>
      </div>
      <div>
        <a name="#skin"></a>
        <p class="lead text-warning">Skin the game</p>
        <div class="col-md-offset-1">
          <p>This game was designed to be skinned. But not just for looks, for much more of the gameplay. Initially, some of that may be limited, but I'll try to document (as I find the time) the (growing) areas that can be changed.</p>
          <p>First and foremost, the whole game is skinned with three files:</p>
          <ul>
            <li>JSON file</li>
            <li>CSS file</li>
            <li>Font image</li>
          </ul>
          <p>The JSON file is the most complex, so we'll look at that later. The CSS file is just that, a stylesheet that is loaded last to be used to skin the site however you want it to look. You may not "need" to touch it at all ... I personally think the site looks ok, although I'm no UI designer ... but you're welcome to. The font image is a "tileset". It's a bunch of squares, or tiles, that you want to use for imagery. The JSON file will be used to determine which squares in the image are displayed where, but the image is expected to be a grid of equally sized images that can be indexed into. You can use a transparent background and solid color and then use the JSON file to style and color them (the way the ASCII version currently works), or you can use a full tileset and just have it drawn on the screen.</p>
          <p>Now, the JSON file requires a lot more detail to explain, and it will likely continue to evolve as the game does.</p>
        </div>
      </div>
    </div>
  </div>

  <?php include("lib/php/end.html");?>
  <script language="javascript">
    $(document).ready(function()
    {
      $("a.spoiler").click(function(e) {
        e.preventDefault();
        $(this).next().toggle();
      });

      $("a.walkthrough-next").click(function(e) {
        e.preventDefault();
        $(this).parent().parent().parent().toggle();
        $(this).parent().parent().parent().next().toggle();
      });
      $("a.walkthrough-prev").click(function(e) {
        e.preventDefault();
        $(this).parent().parent().parent().toggle();
        $(this).parent().parent().parent().prev().toggle();
      });
    });
  </script>
  </body>
</html>
