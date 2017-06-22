console.log('test');

// chrome.tabs.onCreated.addListener(() => {
//   chrome.tabs.query({}, (tabs) => {
//     chrome.tabs.move(tabs[1].id, { index: -1 });
//   });
// });

chrome.tabs.onUpdated.addListener((activeInfo) => {
  chrome.tabs.query({}, (tabs) => {
    chrome.tabs.move(tabs[1].id, { index: -1 });
  });
});
