<?php include("lib/php/head.html");?>
<?php include("lib/php/nav.php");?>

  <div class="top-buffer col-md-10 col-md-offset-1">
    <div class="row">
      <div class="col-lg-12">
        <h1 class="text-primary">GrueCraft</h1>
        <p class="lead text-warning">A crafting, text-based browser game</p>
      </div>
    </div>
    <div class="well">
      <p>I was playing around with some text based games recently and realized they could be a good platform to build a 
      style of game that doesn't require a <i>ton</i> of developer effort, minimal graphics (which I don't have), and 
      still keep fresh and learning a lot of the relevant technologies.</p>
      <p>So I came up with this idea</p>
      <p>I want the game to be a browser game that is reminiscent of games like Zork and the Hitchiker's Guide to the 
      Galaxy that I saw as a kid ages ages ago, but with modern touches and updates that make it easily accessible.</p>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h2>Worlds</h2>
          </div>
          <div class="panel-body">
            <p>What settings could this game be played in?</p>
            <h4 class="text-warning">Myth and Legend</h4>
            <p>First and foremost, a world where there is no real technology. Just people, tribes, and loose organizations. 
            This world is inhabited by strange monsters, dungeons, and treasure. Grow your own personal legend and tribe as 
            you conquer your world.</p>
            <h4 class="text-warning">Space Colonial</h4>
            <p>Avoid environmental hazards and build up your world with automated systems, robots, mines, and settlers. 
            Manage resources well and you might be able to become a player in the interstellar market or become a raider and 
            fortify your world against attack.</p>
            <h4 class="text-warning">Deep Space</h4>
            <p>Travel through deep interstellar space finding new worlds and civilizations. Maintain and upgrade your ship 
            and your crew while avoiding military governments out to kill you and pirates out to set you adrift.</p>
            <h4 class="text-warning">Many more!</h4>
            <p>Pirates on the high seas? Viking raiders? Pastoral villages under attack? Pigs plotting to overthrow the farm? 
            Just about anything should be possible with adjustments to the back end of the same engine.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h2>Maps</h2>
          </div>
          <div class="panel-body">
            <p>The maps will be tile based 2D maps that harken back to the days of ASCII art maps where a <span class="text-warning">.</span> was grassland and a <span class="text-warning">^</span> was a mountain! The maps will be both large, and randomly generated to allow lots of replayability.</p>
            <h4 class="text-warning">Transitions</h4>
            <p>Maps can take players to <i>other</i> maps through special transition points. This way, players who have managed to fully conquer their own map can continue their game. In some worlds, these might be ocean ports, in others, they might be portals. On land, they might be entrances to dungeons.</p>
            <h4 class="text-warning">Danger</h4>
            <p>Time and distance transitions should also happen, though. As you travel further and further from your own main location, things get more dangerous. Similarly, things are more dangerous in the dark. Beware the night and caves with no light!</p>
            <p>In the mean-time, random events will happen all over the map. Dangerous or beneficial, they'll all affect your tribe! This is an "idle" game that you shouldn't walk away from!</p>
            <h4 class="text-warning">Travel</h4>
            <p>Traveling takes effort. Your hero or band of heros needs provisions! Food, water, perhaps fuel ... these all will be required to move people and items across the map.</p>
            <p>Items also take up space and weight! If you sack a village, you have to decide what you can bring back with you or who you might leave to guard you treasure and come get it another day!</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h2>Adventure</h2>
          </div>
          <div class="panel-body">
            <h4 class="text-warning">Military</h4>
            <p>Project your might! Use simple raiders that you outfit on the fly, or build a professional fighting force that you maintain and pay a living wage to. Outfit them with better weapons and training and conquer your neighbors.</p>
            <p>Use your military to station at outposts and protect your territory from random suffering and invading brigands!</p>
            <h4 class="text-warning">Travel</h4>
            <p>Players should be able to update their environment in relatively large ways. Build roads, villages, mines, fisheries, etc. Of course, you'll need to defend them as well! Those features might need to be protected by nearby outposts or castles! We've got plenty of ASCII to work with (for that old-school look) and can investigate simple tiles as well in the future!</p>
            <h4 class="text-warning">Crafting</h4>
            <p>Create tools, better materials, and update your tribe. Start with nothing and build your way up to run the galaxy, but manager your supply lines to make sure you can keep building things you need as you progress!</p>
            <h4 class="text-warning">Treasure</h4>
            <p>Collect the treasure of the world. Use it to pay buy items from traveling caravans, to pay your militaries, to pay off a gumbling citizenry, or even to just save up and buy whole civilizations that you meet! It's your decision!</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <?php include("lib/php/end.html");?>
  </body>
</html>
