// chrome.tabs.onHighlighted.addListener((activeInfo) => {
//   chrome.tabs.query({}, (tabs) => {
//     chrome.tabs.move(tabs[1].id, { index: -1 });
//   });
// });

chrome.tabs.onHighlighted.addListener((activeInfo) => {
  chrome.tabs.query({}, (tabs) => {
    chrome.tabs.move(tabs[1].id, { index: -1 });
  });
});