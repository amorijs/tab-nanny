let virtualTabs = [];
let previousTabIndex;
const leftmp3 = new Audio();
leftmp3.src = 'totheleft.mp3';

// create virtual tabs on start
const initializeVirtualTabs = () => {
  virtualTabs = [];
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabs.forEach(tab => {
      tab.lastUsed = Date.now();
      virtualTabs.push(tab);
    });
  });
};

// query current active window, set equal to prevTabIndex
const initializePreviousTabIndex = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    previousTabIndex = tabs[0].index;
  });
};

initializePreviousTabIndex();
initializeVirtualTabs();

// LISTENERS
chrome.browserAction.onClicked.addListener(() => {
  // get current active tab and make sure its last used is set before sorting
  // query is async, this call will not finish before any calls outside of query
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    virtualTabs[tabs[0].index].lastUsed = Date.now();
    console.log('before sort:', virtualTabs);
    sortByLastUsed(virtualTabs);
    console.log('after sort:', virtualTabs);
    moveTabs();
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    virtualTabs[previousTabIndex].lastUsed = Date.now();
    previousTabIndex = tabs[0].index;
  });
});

// chrome.tabs.onMoved.addListener(() => {
//   initializePreviousTabIndex();
//   initializeVirtualTabs();
// });

const sortByLastUsed = (array) => array.sort((a, b) => b.lastUsed - a.lastUsed);

const moveTabs = (virtTabs) => {
  leftmp3.play();
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    virtualTabs.forEach((virtTab, index) => {
      tabs.forEach((tab) => {
        if (virtTab.id === tab.id) {
          chrome.tabs.move(tab.id, { index });
        }
      });
    });

    initializePreviousTabIndex();
  });
};
