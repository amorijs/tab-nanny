const virtualTabs = [];
let sortedVirtTabs;
let previousTabIndex;
// const leftmp3 = new Audio();
// leftmp3.src = 'totheleft.mp3';

// INITIALIZATION
// on extension start
// query current active window, set equal to prevTabIndex
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  previousTabIndex = tabs[0].index;
});
// create virtual tabs on start
chrome.tabs.query({currentWindow: true}, (tabs) => {
  tabs.forEach(tab => {
    tab.lastUsed = Date.now();
    virtualTabs.push(tab);
    });
});
// LISTENERS
chrome.browserAction.onClicked.addListener(()=>{
  console.log(virtualTabs);
  // get current active tab and make sure its last used is set before sorting
  // query is async, this call will not finish before any calls outside of query
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('before last used updated', virtualTabs[tabs[0].index].lastUsed) 
    virtualTabs[tabs[0].index].lastUsed = Date.now();
    console.log('after last used updated', virtualTabs[tabs[0].index].lastUsed) 
    sortedVirtTabs = sortByLastUsed(virtualTabs);
    console.log(sortedVirtTabs);
  });
  moveTabs();
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('active', virtualTabs[previousTabIndex].title, virtualTabs[previousTabIndex].lastUsed)
    if (previousTabIndex) {
      virtualTabs[previousTabIndex].lastUsed = Date.now();
      console.log(virtualTabs[previousTabIndex].lastUsed)
    }
    console.log('after if conditional')
    previousTabIndex = tabs[0].index;
    // moveTabs();
  });
});


// METHODS
const sortByLastUsed = (array) => array.slice().sort((a, b) => a.lastUsed - b.lastUsed);

const moveTabs = (virtTabs) => {
  // Totheleft move
  // leftmp3.play();
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   setTimeout(() => chrome.tabs.move(tabs[0].id, { index: 0 }), 125);
  // });
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    sortedVirtTabs.forEach((virtTab, index) => {
      tabs.forEach((tab) => {
        if (virtTab.id === tab.id) {
          chrome.tabs.move(tab.id, { index });
        }
      });
      // i += 500;
      // setTimeout(() => chrome.tabs.move(activeTabId, { index: -1 }), i);
    });
  });

};


