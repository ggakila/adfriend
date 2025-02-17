const APIKEY = 'iqvtMNgYEqzk18SBwBs8ekZ5NsTxQ8H8kEzqhybZdWGVgCqK3IUapjCS';
const categories = ['nature', 'art', 'landscape', 'cars', 'animals'];
const jsonFilePath = 'content.json';

//save settings on local storage
const settings = {
  enabled: true,
  disabledSites: [],
  adsLimit: 50,
  colorThemes: 'purplish',
};

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ settings });
  const dynamicRules = [];
  if (dynamicRules && dynamicRules.length > 0) {
    try {
      // Clear existing rules and add new ones if EasyList was loaded successfully
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: dynamicRules.map((rule) => rule.id), // Correct property: removeRuleIds
        addRules: dynamicRules,
      });
      console.log(`Successfully added ${dynamicRules.length} EasyList rules.`);
      // Optionally, fetch feedback rules if you want to track rule matching (more advanced)
      // chrome.declarativeNetRequest.getRuleFeedback().then(feedback => console.log("Rule Feedback:", feedback));
    } catch (error) {
      console.error('Error updating dynamic rules:', error);
    }
  } else {
    console.warn('No rules loaded from EasyList or error during loading.');
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log(`Tab updated: ${tab.url}`);
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
    console.log(response);
    const { photos } = await response.json();
    return { [category]: photos.map((photo) => photo.src.large) };
  });

  const images = await Promise.all(promises);
  return images.reduce((acc, obj) => Object.assign(acc, obj), {});
};

const updateJsonFile = async () => {
  const images = await getImagesFromPexels();

  try {
    const response = await fetch(chrome.runtime.getURL(jsonFilePath));
    const content = await response.json();

    content.images = images;

    await chrome.storage.local.set({ content });
  } catch (error) {
    console.error('Error updating JSON file:', error);
  }
};

updateJsonFile();
