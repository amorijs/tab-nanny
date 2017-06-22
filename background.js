const virtualTabs = [];
let previousTabIndex;

const sortByLastUsed = (array) => array.sort((a, b) => a.lastUsed - b.lastUsed);

const moveTabs = (virtTabs) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('tab', tabs[0])
    console.log(tabs[0].id);
    console.log(chrome.tabs.move(tabs[0].id, {index: -1}));
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
    if (previousTabIndex !== null) {
      virtualTabs[previousTabIndex].lastUsed = Date.now();
    }

    previousTabIndex = tabs[0].index;
    moveTabs();
  });
});


