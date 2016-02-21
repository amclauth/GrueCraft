<?php include("lib/php/head.html");?>
<?php include("lib/php/nav.php");?>

  <div class="top-buffer col-md-10 col-md-offset-1">
    <?php
      $myfile = fopen("notes.txt","r") or die ("Can't open notes.txt!");
      
      while (!feof($myfile))
      {
        $line = chop(fgets($myfile));
        if (preg_match("/^http/",$line))
        {
          $line = "<a href=\"" . $line . "\">" . $line . "</a>";
        }
        print "<p>" . $line . "</p>\n";
      }
      fclose($myfile);
    ?>
  </div>

  <?php include("lib/php/end.html");?>
  </body>
</html>
