const virtualTabs = [];
let previousTabIndex;
const leftmp3 = new Audio();
leftmp3.src = 'totheleft.mp3';

const sortByLastUsed = (array) => array.sort((a, b) => a.lastUsed - b.lastUsed);

const moveTabs = (virtTabs) => {
  leftmp3.play();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    setTimeout(() => chrome.tabs.move(tabs[0].id, { index: 0 }), 125);
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
    moveTabs();
  });
});
