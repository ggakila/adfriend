const APIKEY = 'iqvtMNgYEqzk18SBwBs8ekZ5NsTxQ8H8kEzqhybZdWGVgCqK3IUapjCS';
const categories = ['nature', 'art', 'landscape', 'cars', 'animals'];
const jsonFilePath = 'content.json';
const updateInterval = 60 * 60 * 1000;

//save settings on local storage

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
