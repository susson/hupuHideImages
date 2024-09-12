let isEnabled = true;

function blockImages(blockedUrls) {
  if (!isEnabled) return;
  const images = document.getElementsByTagName('img');
  for (let img of images) {
    if (blockedUrls.some(url => img.src.includes(url))) {
      img.style.display = 'none';
    } else {
      img.style.display = '';
    }
  }
}

chrome.storage.sync.get(['blockedUrls', 'isEnabled'], (data) => {
  isEnabled = data.isEnabled !== false;
  blockImages(data.blockedUrls || []);
});

const observer = new MutationObserver(() => {
  chrome.storage.sync.get('blockedUrls', (data) => {
    blockImages(data.blockedUrls || []);
  });
});

observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateBlockedImages") {
    blockImages(request.blockedUrls);
  } else if (request.action === "toggleBlocking") {
    isEnabled = request.isEnabled;
    chrome.storage.sync.get('blockedUrls', (data) => {
      blockImages(data.blockedUrls || []);
    });
  }
});