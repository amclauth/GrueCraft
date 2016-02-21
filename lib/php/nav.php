<?php 
  $amt = trim(file_get_contents("/data/www/html/projects/gruecraft/amount.txt")); 
  if ($amt < 100)
  {
    print '<div id="adbanner">\n';
    print '  <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>\n';
    print '  <!-- GrueCraft -->\n';
    print '  <ins class="adsbygoogle"\n';
    print '       style="display:inline-block;width:728px;height:90px"\n';
    print '       data-ad-client="ca-pub-4130063876379389"\n';
    print '       data-ad-slot="5978638557"></ins>\n';
    print '  <script>\n';
    print '  (adsbygoogle = window.adsbygoogle || []).push({});\n';
    print '  </script>\n';
    print '</div>\n';
  }
  ?>
  <div class="navbar navbar-default navbar-fixed-top" role="navigation" id="mytopnavbar">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-main">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="http://home.mclauthlin.com/projects/gruecraft" class="navbar-brand">GrueCraft</a>
      </div>
      <div class="navbar-collapse collapse" id="navbar-main">
        <ul class="nav navbar-nav">
          <li><a href="game.php">Play!</a></li>
          <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" id="guide">Guide <span class="caret"></span></a>
            <ul class="dropdown-menu" aria-labelledby="guide">
              <li><a href="guide.php">Game Guide</a></li>
              <li><a href="ideas.php">Further Ideas</a></li>
              <li><a href="mapgen.php">Map Generator</a></li>
              <li><a href="tech.php">Tech Tree</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" id="builtwith">Built With <span class="caret"></span></a>
            <ul class="dropdown-menu" aria-labelledby="builtwith">
              <li><a href="http://getbootstrap.com">Bootstrap</a></li>
              <li><a href="http://jquery.com">jQuery</a></li>
              <li><a href="https://bootswatch.com/darkly">Darkly</a></li>
              <li><a href="http://mclauthlintech.com">McLauthlinTech</a></li>
              <li><a href="http://www.evilpaul.org/wp/2013/01/30/textmode-in-your-browser-with-html-and-javascript/">EvilPaul</a></li>
              <li><a href="http://arborjs.org">Arbor.js</a></li>
              <li>Fire Emblem (TileSet)</li>
              <li>Ultima V (TileSet)</li>
            </ul>
          </li>
        </ul> 
      </div>
    </div>
  </div>

