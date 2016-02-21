<?php
  header ('HTTP/1.1 200OK');
  $paymentStatus = $_POST['payment_status'];
  $payment_amount = $_POST['mc_gross'];

  // Build the required acknowledgement message out of the notification just received  
  $req = 'cmd=_notify-validate';               // Add 'cmd=_notify-validate' to beginning of the acknowledgement
  foreach ($_POST as $key => $value) {         // Loop through the notification NV pairs
    $value = urlencode(stripslashes($value));  // Encode these values
    $req  .= "&$key=$value";                   // Add the NV pairs to the acknowledgement
  }

// Set up the acknowledgement request headers
  $header  = "POST /cgi-bin/webscr HTTP/1.1\r\n";                    // HTTP POST request
  $header .= "Host: www.sandbox.paypal.com\r\n";
  $header .= "Content-Type: application/x-www-form-urlencoded\r\n";
  $header .= "Content-Length: " . strlen($req) . "\r\n\r\n";

  // Open a socket for the acknowledgement request
  $fp = fsockopen('tls://www.sandbox.paypal.com', 443, $errno, $errstr, 30);

  // Send the HTTP POST request back to PayPal for validation
  fputs($fp, $header . $req);

  while (!feof($fp)) {                     // While not EOF
    $res = fgets($fp, 1024);               // Get the acknowledgement response
    if (strcmp ($res, "VERIFIED") == 0) {  // Response contains VERIFIED - process notification
      $retries = 0;
      $file = "/data/www/html/projects/gruecraft/amount.txt";
      $lockfile = "/data/www/html/projects/gruecraft/amount.lck";
      $fp = fopen($lockfile);
      $max_retries = 100;
      do
      {
        if ($retries > 0) 
        {
          usleep(rand(1,1000));
        }
        $retries++;
      } while (!flock($fp, LOCK_EX) and $retries <= $max_retries);

      if ($retries < $max_retries)
      {
        $amt = file_get_contents($file);
        $amt += $payment_amount;
        file_put_contents($file,$amt);
      }
      flock($fp, LOCK_UN);
      fclose($fp);

      $mail_to = "andrew@mclauthlintech.com";
      $mail_from = "FROM: andrew@mclauthlintech.com";
      $mail_subj = "Gruecraft donation (" + $payment_amount + ")";
      $mail_body = "Donation of " + $payment_amount + "\n" + 
                   "Total now: " + $amt + "\n";
      mail($mail_to, $mail_subj, $mail_body, $mail_from);

      break;

      // Send an email announcing the IPN message is VERIFIED
/*      $mail_From    = "IPN@example.com";
      $mail_To      = "Your-eMail-Address";
      $mail_Subject = "VERIFIED IPN";
      $mail_Body    = $req;
      mail($mail_To, $mail_Subject, $mail_Body, $mail_From);*/

      // Authentication protocol is complete - OK to process notification contents

      // Possible processing steps for a payment include the following:

      // Check that the payment_status is Completed
      // Check that txn_id has not been previously processed
      // Check that receiver_email is your Primary PayPal email
      // Check that payment_amount/payment_currency are correct
      // Process payment

    } 
    else if (strcmp ($res, "INVALID") == 0) { //Response contains INVALID - reject notification
      break;

      // Authentication protocol is complete - begin error handling

      // Send an email announcing the IPN message is INVALID
/*      $mail_From    = "IPN@example.com";
      $mail_To      = "Your-eMail-Address";
      $mail_Subject = "INVALID IPN";
      $mail_Body    = $req;

      mail($mail_To, $mail_Subject, $mail_Body, $mail_From);*/
    }
  }

  fclose($fp); // close the file
?>
