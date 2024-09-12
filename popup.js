document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const optionsButton = document.getElementById('optionsButton');

  // 加载并设置开关状态
  chrome.storage.sync.get('isEnabled', function(data) {
    toggleSwitch.checked = data.isEnabled !== false;  // 默认为true
  });

  // 监听开关变化
  toggleSwitch.addEventListener('change', function() {
    chrome.storage.sync.set({isEnabled: this.checked}, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleBlocking", isEnabled: toggleSwitch.checked});
      });
    });
  });

  // 打开选项页面
  optionsButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
});

// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "blockImage",
    title: "屏蔽图片",
    contexts: ["image"],
    documentUrlPatterns: ["https://bbs.hupu.com/*"]
  });

  chrome.storage.sync.get(['blockedUrls', 'isEnabled'], (data) => {
    if (!data.blockedUrls) {
      chrome.storage.sync.set({ blockedUrls: [] });
    }
    if (data.isEnabled === undefined) {
      chrome.storage.sync.set({ isEnabled: true });
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "blockImage") {
    chrome.storage.sync.get(['blockedUrls', 'isEnabled'], (data) => {
      if (data.isEnabled) {
        let blockedUrls = data.blockedUrls || [];
        if (!blockedUrls.includes(info.srcUrl)) {
          blockedUrls.push(info.srcUrl);
          chrome.storage.sync.set({ blockedUrls }, () => {
            chrome.tabs.sendMessage(tab.id, { action: "updateBlockedImages", blockedUrls });
          });
        }
      }
    });
  }
});