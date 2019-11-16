const CSS = "body { border: 20px solid red; }";
const TITLE_APPLY = "Apply CSS";
const TITLE_REMOVE = "Remove CSS";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

async function downloadPages(tab) {
  // Inject script in page (requires activeTab permission).
  await browser.tabs.executeScript(tab.id, {
    file: "contentscript.js",
  });
}

var fetched = {};

function connected(p) {
  p.onMessage.addListener(function(m) {
    if (!(m.doc in fetched))
      fetched[m.doc] = {};
    if (m.page in fetched[m.doc])
      return;
    fetched[m.doc][m.page] = true;

    browser.downloads.download({
      url : m.url,
      filename : m.doc + "_" + m.page.padStart(4, "0") + ".png"
    });
  });
}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
*/
function urlIsApplicable(url) {
  return /^https\:\/\/wenku.baidu.com\/view\/[a-f0-9]+\.html/.test(url)
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (urlIsApplicable(tab.url)) {
    browser.pageAction.setIcon({tabId: tab.id, path: "icons/off.svg"});
    browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
    browser.pageAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

/*
Toggle CSS when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(downloadPages);
browser.runtime.onConnect.addListener(connected);
