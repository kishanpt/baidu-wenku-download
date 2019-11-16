"use strict";
(async () => {
  var myPort = browser.runtime.connect({name:"port-from-cs"});
  myPort.onMessage.addListener(function(m) {
    // stop, maybe
  });

  var pages = document.querySelectorAll('#reader-container-inner-1 .reader-page div[data-page-no]');
  var documentName = document.getElementById("doc-tittle-0").innerText;

  setInterval(() => {
    for (var i=0; i<pages.length; i++) {
      var page = pages[i];
      try {
        var pageNum = page.attributes['data-page-no'].value;
        var bg = page.querySelectorAll('.reader-pic-item')[0].style.backgroundImage;
        var url = bg.substr(5, bg.length-7);

        myPort.postMessage({url: url, page: pageNum, doc: documentName});
      } catch(e) {
      }
    }
  }, 500);
})();



