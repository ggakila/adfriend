const APIKEY = 'iqvtMNgYEqzk18SBwBs8ekZ5NsTxQ8H8kEzqhybZdWGVgCqK3IUapjCS';
const categories = ['nature', 'art', 'landscape', 'cars', 'animals'];
const jsonFilePath = 'content.json';
const updateInterval = 60 * 60 * 1000;

//save settings on local storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isOn: true,
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.local.get(['isOn', 'adsBlocked', 'whitelist'], (data) => {
      sendResponse(data);
    });
    return true; // Allows async response
  }

  if (message.type === 'TOGGLE_EXTENSION') {
    chrome.storage.local.set({ isOn: message.isOn });
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: message.isOn ? ['ruleset_1'] : [],
      disableRulesetIds: message.isOn ? [] : ['ruleset_1'],
    });
  }

  if (message.type === 'TOGGLE_WHITELIST') {
    chrome.storage.local.get('whitelist', (data) => {
      let whitelist = data.whitelist || [];
      if (message.isWhitelisted) {
        whitelist = whitelist.filter((site) => site !== message.site);
      } else {
        whitelist.push(message.site);
      }
      chrome.storage.local.set({ whitelist });
    });
  }
});

const getImagesFromPexels = async () => {
  const promises = categories.map(async (category) => {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${category}&per_page=10`,
      {
        headers: { Authorization: `${APIKEY}` },
      }
    );

    const { photos } = await response.json();
    return { [category]: photos.map((photo) => photo.src.medium) };
  });

  const images = await Promise.all(promises);
  return images.reduce((acc, obj) => Object.assign(acc, obj), {});
};

const updateJsonFile = async () => {
  try {
    const images = await getImagesFromPexels();

    const response = await fetch(chrome.runtime.getURL(jsonFilePath));
    const content = await response.json();

    content.images = images;

    await chrome.storage.local.set({ content });
  } catch (error) {
    console.error('Error updating JSON file:', error);
  }
};

setInterval(updateJsonFile, updateInterval);
updateJsonFile();
