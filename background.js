const virtualTabs = [];
let previousTabIndex;

const sortByLastUsed = (array) => array.slice(0).sort((a, b) => a.lastUsed - b.lastUsed);

const moveTabs = (virtTabs) => {
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   setTimeout(() => chrome.tabs.move(tabs[0].id, { index: 0 }), 125);
  // });
  const sortedVirtualTabs = sortByLastUsed(virtualTabs);
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    sortedVirtualTabs.forEach((virtTab, index) => {
      let i = 0;
      let activeTabId;
      tabs.forEach((tab) => {
        i += 500;
        if (virtTab.id === tab.id) setTimeout(() => chrome.tabs.move(tab.id, { index }), i);
        if (tab.active) activeTabId = tab.id;
      });
      // i += 500;
      // setTimeout(() => chrome.tabs.move(activeTabId, { index: -1 }), i);
    });
  });
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  previousTabIndex = tabs[0].index;
});

chrome.tabs.query({}, (tabs) => {
  tabs.forEach(tab => virtualTabs.push(tab));
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (previousTabIndex) {
      virtualTabs[previousTabIndex].lastUsed = Date.now();
    }

    previousTabIndex = tabs[0].index;
    // moveTabs();
  });
});

setTimeout(moveTabs, 10000);
