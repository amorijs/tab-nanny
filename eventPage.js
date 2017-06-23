let virtualTabs = [];
let previousTabIndex;
let currentlyMoving = false;
const leftmp3 = new Audio();
leftmp3.src = 'totheleft.mp3';

// create virtual tabs on start
const initializeVirtualTabs = () => {
  if (currentlyMoving) return;

  virtualTabs = [];
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    console.log('BEFORE:', virtualTabs);
    tabs.forEach(tab => {
      tab.lastUsed = Date.now();
      virtualTabs.push(tab);
    });
    console.log('AFTER:', virtualTabs);
  });
};

// query current active window, set equal to prevTabIndex
const initializePreviousTabIndex = () => {
  console.log('in initiprevtabind, currentlyMoving: ', currentlyMoving);
  if (currentlyMoving) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    previousTabIndex = tabs[0].index;
  });
};

initializePreviousTabIndex();
initializeVirtualTabs();

// LISTENERS
chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    virtualTabs[tabs[0].index].lastUsed = Date.now();
    sortByLastUsed(virtualTabs);
    moveTabs();
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    virtualTabs[previousTabIndex].lastUsed = Date.now();
    previousTabIndex = tabs[0].index;
  });
});

chrome.tabs.onMoved.addListener(() => {
  initializePreviousTabIndex();
  initializeVirtualTabs();
});

chrome.tabs.onCreated.addListener(() => {
  initializePreviousTabIndex();
  initializeVirtualTabs()
});

chrome.tabs.onRemoved.addListener(() => {
  initializePreviousTabIndex();
  initializeVirtualTabs()
});

chrome.tabs.onAttached.addListener(() => {
  initializePreviousTabIndex();
  initializeVirtualTabs()
});

chrome.tabs.onDetached.addListener(() => {
  initializePreviousTabIndex();
  initializeVirtualTabs()
});

const sortByLastUsed = (array) => array.sort((a, b) => b.lastUsed - a.lastUsed);

const moveTabs = (virtTabs) => {
  leftmp3.play();
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    currentlyMoving = true;
    const promises = [];
    virtualTabs.forEach((virtTab, index) => {
      tabs.forEach((tab) => {
        if (virtTab.id === tab.id) {
          let currentIndex = promises.length;
          promises.push(new Promise((resolve, reject) => {
            chrome.tabs.move(tab.id, { index }, () => resolve());
          }));
        }
      });
    });
    Promise.all(promises).then(() => {
      currentlyMoving = false;
      console.log(virtualTabs);
      initializePreviousTabIndex();
    });
  });
};
