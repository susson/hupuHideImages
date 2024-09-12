chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "blockImage",
    title: "屏蔽图片",
    contexts: ["image"],
    documentUrlPatterns: ["https://bbs.hupu.com/*"]
  });

  chrome.storage.sync.get('blockedUrls', (data) => {
    if (!data.blockedUrls) {
      chrome.storage.sync.set({ blockedUrls: [] });
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "blockImage") {
    chrome.storage.sync.get('blockedUrls', (data) => {
      let blockedUrls = data.blockedUrls || [];
      if (!blockedUrls.includes(info.srcUrl)) {
        blockedUrls.push(info.srcUrl);
        chrome.storage.sync.set({ blockedUrls }, () => {
          chrome.tabs.sendMessage(tab.id, { action: "updateBlockedImages", blockedUrls });
        });
      }
    });
  }
});