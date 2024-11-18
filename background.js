// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }).then(() => {
    // After content script is loaded, execute the emulation function
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.applyIphoneEmulation()
    });
  });
  
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['styles.css']
  });
});