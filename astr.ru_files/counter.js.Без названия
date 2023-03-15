var msk_stat = 'M1';

function statsMosRuCounter() {
  var el = document.getElementById("statsmosru");
  if (!el) return true;
  var div = document.createElement("div");
  el.parentNode.insertBefore(div, el);
  return true;
}

!function () {
  var c = document.createElement("script");
  var time = Date.now();
  var suffix = "?time=" + time;
  c.setAttribute("src", "https://stats.mos.ru/handler/handler.js" + suffix);
  document.head.appendChild(c);
}();
