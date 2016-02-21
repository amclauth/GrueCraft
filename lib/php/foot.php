<?php $amount = trim(file_get_contents("/data/www/html/projects/gruecraft/amount.txt")); ?>
    <footer class="navbar-fixed-bottom">
      <div class="container">
        <ul class="navbar-right">
          <li class="text-muted"><a href="donate.php">
          <?php
            if ($amount >= 100)
            {
              echo "Donate";
            }
            else
            {
              echo "Remove Ads";
            }
          ?>
          </a></li>
          <li class="text-muted"><a href="#" id="resetButton">Reset Game</a></li>
          <li class="text-muted"><a href="#" id="fogofwarToggle">Fog Of War</a></li>
          <li class="text-muted"><a href="#" id="legendToggle">Legend</a></li>
          <li class="text-muted"><a href="#" id="clockToggle">Pause</a></li>
          <li class="dropdown">
            <a class="dropdown-toggle" href="#" data-toggle="dropdown" id="styleDrop">Style <span class="dropup"><span class="caret"></span></span></a>
            <ul class="dropdown-menu" aria-labeledby="styleDrop">
              <li class="text-muted"><a href="#" id="asciiToggle">ASCII</a></li>
              <li class="text-muted"><a href="#" id="tileToggle">Tiles</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </footer>
