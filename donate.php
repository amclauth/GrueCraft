<?php include("lib/php/d_head.html"); ?>
<?php include("lib/php/nav.php"); ?>
<?php $amount = trim(file_get_contents("/data/www/html/projects/gruecraft/amount.txt")); ?>

  <div class="top-buffer">
    <div class="row">
      <div class="col-md-2" id="meter">
        <canvas id="meterCanvas"></canvas>
      </div>
      <div class="col-md-10" id="content">
        <div class="col-sm-12">
          <?php
          if ($amount >= 100)
          {
            echo "<h1 class='text-primary' id='donateTitle'>Ads are Removed!</h1>\n";
          }
          else
          {
            echo "<h1 class='text-primary' id='donateTitle'>Help Remove Ads</h1>\n";
          }
        ?>
        </div>
        <div class="well">
          <div><center>
            <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L9VZVNZAHM6W2"><img src="pp_donate.png"></a>
          </center></div>
          <div class="row top-buffer">
            <div class="col-sm-offset-4 col-sm-1">
              <center>
                <div class="round-button">
                  <div class="round-button-circle">
                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SZPZDCN5Y2KWG" class="round-button">$1</a> 
                  </div>
                </div>
              </center>
            </div>
            <div class="col-sm-1">
              <center>
                <div class="round-button">
                  <div class="round-button-circle">
                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GRMPVS7Z8R298" class="round-button">$5</a> 
                  </div>
                </div>
              </center>
            </div>
            <div class="col-sm-1">
              <center>
                <div class="round-button">
                  <div class="round-button-circle">
                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9A3YNPVLWUGM2" class="round-button">$10</a> 
                  </div>
                </div>
              </center>
            </div>
            <div class="col-sm-1">
              <center>
                <div class="round-button">
                  <div class="round-button-circle">
                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RHXXG789MXVCE" class="round-button">$20</a> 
                  </div>
                </div>
              </center>
            </div>
          </div>
          <?php
          if ($amount >= 100)
          {
            echo "<p>The advertisements are gone for the rest of the year! Thanks for being awesome! If you still want to donate to the \"feed the hungy engineer\" fund, by all means, your donations are appreciated and will go towards making the game better and more complex!</p>\n";
          }
          else
          {
            echo "<p>It costs money to host this website, so I'm trying to recoup some of that with the banner ads. Sorry. I hate them, too, but it helps keep the site running!</p>\n";
            echo "<p>However, here's a couple deals I'll make.</p>\n";
          }
        ?>
          <div class="row">
            <div class="col-md-6">
              <div class="panel panel-primary">
                <div class="panel-heading">
                  <p>Combined $100USD removes the banner ad for everyone for the rest of the year.</p>
                </div>
                <div class="panel-body">
                  <p>If people (anywhere and everywhere) donate a total of $100 USD any given year, I'll remove the banner ad for the rest of the calendar year. This will be a yearly thing (since the website costs are yearly). I'll keep the site updated with confirmed funds that come in so everyone knows how much more there is till we hit this benchmark.</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="panel panel-primary">
                <div class="panel-heading">
                  <p>More donations = More updates.</p>
                </div>
                <div class="panel-body">
                  <p>I've got plenty of other responsibilities and money is what pays the bills. If people like this game and keep donating to it, I'll keep working on it. I have a bunch of ideas still to develop, and I'm sure you do, too! Let me know what they are, maybe I can get them in!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p>If you like the game, throw me a couple dollars to help support it staying up! If you play it a lot, throw me a couple dollars for the effort to bring it to you!</p>
          <p>What will I do with this money? Well, first, I'll pay for the upcoming hosting costs and domain name. After that, I'll probably buy dinner for my very understanding wife who deserves much more than the pizza and pepsi we'll be having that night. If there's still money left over, I'll continue to add and develop as much as possible!</p>
          <p>I use paypal to handle all transactions. It's safe for you, and a recognized name. Use the buttons above to select a level of support or click "Donate with Paypal" to select your own amount.</p>
        </div>
      </div>
    </div>
  </div>
  </body>
  <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="lib/js/ext/jquery-2.0.3.min.js"></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="lib/js/ext/bootstrap.min.js"></script>
  <script src="lib/js/donate.js"></script>
  <script language="javascript">
  // if val >= 100, add a big thank you banner
    $(document).ready(function()
    {
      gruecraft.donate.init();
      var amt = <?php echo trim(file_get_contents("/data/www/html/projects/gruecraft/amount.txt")); ?>;
      gruecraft.donate.animate(0,amt);
      setInterval(function()
        {
          $.get("http://home.mclauthlin.com/projects/gruecraft/amount.txt", function(data)
            {
              var newamt = Number(data.trim()); 
              console.log(newamt);
              if (amt != newamt)
              {
                console.log(newamt);
                gruecraft.donate.animate(amt,newamt);
                amt = newamt;
              }
            });
        },10000);
    }); 
    $(window).resize(function()
    {
      gruecraft.donate.init();
      gruecraft.donate.draw(0);
    });
  </script>
        
</html>
