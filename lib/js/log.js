var gruecraft = gruecraft || {};

gruecraft.logger = (function()
{
  var logroll = function(str)
  {
    $("<div class=\"logroll\">" + str + "</div>\n")
      .prependTo("#log")
      .hide()
      .css('opacity', 0)
      .slideDown("fast")
      .animate(
        { opacity: 1 },
        { queue: false, duration: 'slow' }
      );

    if ($("#log > div").length >= 10)
    {
      var n1 = 5;
      var n2 = 11;
      for (var ii = n1; ii < $("#log > div").length; ii++)
      {
        var item = $("#log > div").eq(ii);
        var opacity = .95 - .9/(n2-n1+1)*(ii-n1);
        if (opacity <= 0)
        {
          $("#log > div").eq(ii).remove();
        }
        else
        {
          $("#log > div").eq(ii).fadeTo(200,opacity);
        }
      }
    }
  };

  return {
    log: logroll
  };

})();
