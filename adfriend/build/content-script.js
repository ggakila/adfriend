//inject content script to the page
console.log('content script injected');

window.addEventListener('load', async function () {
  const { settings } = (await chrome.storage.local.get('settings')) || {};
  console.log(settings);

  const all_ad_elems = Array.from(
    document.querySelectorAll(".ad-slot, .ads, [id^='!ad'], [class^='ad']")
  );

  const ads_content = [
    'Avoid ads by subscribing to our premium service',
    'This is not an ad but a motivational quote',
    'This is a placeholder for non intrusive ads',
  ];

  const meme_urls = [
    'https://api.memegen.link/images/oprah/you_get/animated_text.gif',
    'https://api.memegen.link/images/pigeon/Engineer/_/Is_this_Photoshop~q.png?style=https://i.imgur.com/W0NXFpQ.png',
    'https://api.memegen.link/images/rollsafe/When_you_have_a_really_good_idea.webp?layout=top',
  ];

  const limitedAds = all_ad_elems.slice(
    0,
    settings?.adsLimit || all_ad_elems.length
  );

  console.log(limitedAds);
  limitedAds.forEach((elem) => {
    elem.innerHTML = `
        <img src="${
          meme_urls[Math.floor(Math.random() * meme_urls.length)]
        }" alt="meme" style="object-fit: contain;" />`;
  });
});
