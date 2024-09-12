document.addEventListener('DOMContentLoaded', () => {
  const urlList = document.getElementById('urlList');
  const addUrl = document.getElementById('addUrl');
  const addButton = document.getElementById('addButton');

  function loadBlockedUrls() {
    chrome.storage.sync.get('blockedUrls', (data) => {
      const blockedUrls = data.blockedUrls || [];
      urlList.innerHTML = '';
      blockedUrls.forEach((url, index) => {
        addUrlToTable(url, index + 1);
      });
    });
  }

  function addUrlToTable(url, index) {
    const row = urlList.insertRow();
    row.innerHTML = `
      <td>${index}</td>
      <td>${url}</td>
      <td><img src="${url}" alt="Preview" onerror="this.src='placeholder.png'"></td>
      <td><button class="delete-btn" data-url="${url}">删除</button></td>
    `;
  }

  function saveBlockedUrls(blockedUrls) {
    chrome.storage.sync.set({ blockedUrls }, () => {
      console.log('设置已保存');
      loadBlockedUrls();
    });
  }

  addButton.addEventListener('click', () => {
    const newUrl = addUrl.value.trim();
    if (newUrl) {
      chrome.storage.sync.get('blockedUrls', (data) => {
        const blockedUrls = data.blockedUrls || [];
        if (!blockedUrls.includes(newUrl)) {
          blockedUrls.push(newUrl);
          saveBlockedUrls(blockedUrls);
          addUrl.value = '';
        } else {
          alert('该URL已在列表中。');
        }
      });
    }
  });

  urlList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const urlToDelete = e.target.getAttribute('data-url');
      chrome.storage.sync.get('blockedUrls', (data) => {
        const blockedUrls = data.blockedUrls || [];
        const updatedUrls = blockedUrls.filter(url => url !== urlToDelete);
        saveBlockedUrls(updatedUrls);
      });
    }
  });

  loadBlockedUrls();
});