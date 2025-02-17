//inject content script to the page




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

  limitedAds.forEach((elem) => {
    console.log(elem);
    elem.innerHTML = `
        <img src="${
          meme_urls[Math.floor(Math.random() * meme_urls.length)]
        }" alt="meme" style="object-fit: contain;" />`;
    elem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="cccoil-grad"><stop stop-color="hsl(206, 75%, 49%)" stop-opacity="1" offset="0%"></stop><stop stop-color="hsl(331, 90%, 56%)" stop-opacity="1" offset="100%"></stop></linearGradient></defs><g stroke="url(#cccoil-grad)" fill="none" stroke-linecap="round"><circle r="363" cx="400" cy="400" stroke-width="7" stroke-dasharray="1939 2281" transform="rotate(360, 400, 400)" opacity="0.05"></circle><circle r="346.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="1762 2177" transform="rotate(343, 400, 400)" opacity="0.10"></circle><circle r="330" cx="400" cy="400" stroke-width="7" stroke-dasharray="1595 2073" transform="rotate(326, 400, 400)" opacity="0.14"></circle><circle r="313.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="1435 1970" transform="rotate(309, 400, 400)" opacity="0.19"></circle><circle r="297" cx="400" cy="400" stroke-width="7" stroke-dasharray="1284 1866" transform="rotate(291, 400, 400)" opacity="0.23"></circle><circle r="280.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="1141 1762" transform="rotate(274, 400, 400)" opacity="0.28"></circle><circle r="264" cx="400" cy="400" stroke-width="7" stroke-dasharray="1007 1659" transform="rotate(257, 400, 400)" opacity="0.32"></circle><circle r="247.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="881 1555" transform="rotate(240, 400, 400)" opacity="0.37"></circle><circle r="231" cx="400" cy="400" stroke-width="7" stroke-dasharray="764 1451" transform="rotate(223, 400, 400)" opacity="0.41"></circle><circle r="214.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="655 1348" transform="rotate(206, 400, 400)" opacity="0.46"></circle><circle r="198" cx="400" cy="400" stroke-width="7" stroke-dasharray="554 1244" transform="rotate(189, 400, 400)" opacity="0.50"></circle><circle r="181.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="462 1140" transform="rotate(171, 400, 400)" opacity="0.55"></circle><circle r="165" cx="400" cy="400" stroke-width="7" stroke-dasharray="378 1037" transform="rotate(154, 400, 400)" opacity="0.59"></circle><circle r="148.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="302 933" transform="rotate(137, 400, 400)" opacity="0.64"></circle><circle r="132" cx="400" cy="400" stroke-width="7" stroke-dasharray="235 829" transform="rotate(120, 400, 400)" opacity="0.68"></circle><circle r="115.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="176 726" transform="rotate(103, 400, 400)" opacity="0.73"></circle><circle r="99" cx="400" cy="400" stroke-width="7" stroke-dasharray="126 622" transform="rotate(86, 400, 400)" opacity="0.77"></circle><circle r="82.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="84 518" transform="rotate(69, 400, 400)" opacity="0.82"></circle><circle r="66" cx="400" cy="400" stroke-width="7" stroke-dasharray="50 415" transform="rotate(51, 400, 400)" opacity="0.86"></circle><circle r="49.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="25 311" transform="rotate(34, 400, 400)" opacity="0.91"></circle><circle r="33" cx="400" cy="400" stroke-width="7" stroke-dasharray="8 207" transform="rotate(17, 400, 400)" opacity="0.95"></circle><circle r="16.5" cx="400" cy="400" stroke-width="7" stroke-dasharray="0 104" opacity="1.00"></circle></g></svg>`;
  });
});
