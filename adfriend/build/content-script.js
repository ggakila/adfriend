//inject content script to the page

window.addEventListener('load', async function () {
  const { settings, content } = await chrome.storage.local.get([
    'settings',
    'content',
  ]);

  if (
    !settings?.enabled ||
    settings.whitelist?.includes(window.location.hostname)
  )
    return;

  const selectedCategories = settings.selectedCategories || [];
  const images = content.images || {};
  const { nature, art, landscape, cars, animals } = images;
  const memes = content.memes || [];
  const jokes = content.jokes || [];
  const quotes = content.quotes || [];
  const textures = content.textures || [];

  const all_ad_elems = Array.from(
    document.querySelectorAll(".ad-slot, .ads, [id^='!ad'], [class^='ad']")
  );

  const categoriesMap = {
    memes: memes,
    jokes: jokes,
    motivation: quotes,
    textures: textures,
    nature: nature,
    art: art,
    landscape: landscape,
    cars: cars,
    animals: animals,
  };

  const categories = selectedCategories.map((category) =>
    category.toLowerCase()
  );

  const availableTypes = Object.keys(categoriesMap).filter((type) =>
    categories.includes(type.toLocaleLowerCase())
  );

  const adfriendTag = document.createElement('div');
  adfriendTag.innerHTML = `<div style="position: absolute; bottom: 5px; right: 5px; display: flex; align-items: center; font-size: 12px; color: gray; background: rgba(0, 0, 0, 0.05); padding: 3px 6px; border-radius: 4px;">
               By AdFriend
            </div>`;

  all_ad_elems.forEach((elem, index) => {
    if (!availableTypes.length) return;

    //randomly select a type from available types
    const type = availableTypes[index % availableTypes.length].toLowerCase();

    if (
      type === 'nature' ||
      type === 'art' ||
      type === 'landscape' ||
      type === 'cars' ||
      type === 'animals'
    ) {
      const category = categories.find((cat) => images[cat]?.length);
      if (category) {
        const imageList = images[category];
        elem.innerHTML = `<img src="${
          imageList[Math.floor(Math.random() * imageList.length)]
        }" alt="${category}" style="object-fit: contain;" /> ${
          adfriendTag.innerHTML
        }`;
      }
    } else if (type === 'memes') {
      elem.innerHTML = `<img src="${
        memes[Math.floor(Math.random() * memes.length)].url
      }" alt="meme" style="object-fit: contain;" /> ${adfriendTag.innerHTML}`;
    } else if (type === 'jokes') {
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      elem.innerHTML = `
          <div style="padding:10px; font-family:Arial;">
            <p><strong>${joke.question}</strong></p>
            <p>${joke.answer}</p>
          </div> ${adfriendTag.innerHTML}`;
    } else if (type === 'motivation') {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      elem.innerHTML = `
          <div style="padding:10px; font-family:Arial;">
            <p>"${quote.quote}"</p>
            <p>- ${quote.author}</p>
          </div> ${adfriendTag.innerHTML}`;
    } else if (type === 'textures') {
      elem.innerHTML =
        textures[Math.floor(Math.random() * textures.length)].svg;
    }
  });
});
