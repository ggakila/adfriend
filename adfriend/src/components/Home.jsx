import { useState, useEffect } from 'react';
import { Power, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function Home() {
  const { themeColor } = useTheme();
  const [isOn, setIsOn] = useState(false);
  const [adsBlocked, setAdsBlocked] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, (data) => {
      setIsOn(data.isOn || false);
      if (data.whitelist && currentUrl) {
        setIsWhitelisted(data.whitelist.includes(currentUrl));
      }
    });
    chrome.runtime.sendMessage(
      { action: 'getAdCount', host: currentUrl },
      (response) => {
        setAdsBlocked(response.blockedAds || 0);
      }
    );
  }, [currentUrl]);

  useEffect(() => {
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          setCurrentUrl(new URL(tabs[0].url).hostname);
          chrome.runtime.onMessage.addListener((message) => {
            console.log(message);
            if (
              message.action === 'updateAdCount' &&
              message.host === currentUrl
            ) {
              setAdsBlocked(message.blockedAds);
            }
          });
        }
      });
    }
  }, [currentUrl]);

  const toggleExtension = () => {
    setIsOn((prev) => !prev);
    chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION', isOn: !isOn });
  };

  const toggleWhitelist = () => {
    chrome.runtime.sendMessage({
      type: 'TOGGLE_WHITELIST',
      site: currentUrl,
      isWhitelisted,
    });
    setIsWhitelisted((prev) => !prev);
  };

  return (
    <div className='absolute inset-0 flex flex-col gap-10 justify-center items-center p-8'>
      <div className='flex flex-col items-center justify-center'>
        {isOn && (
          <div
            className={`w-48 h-48 rounded-full bg-${themeColor}-500 opacity-30 animate-pulse absolute blur-3xl`}
          ></div>
        )}

        <h1 className="text-6xl font-bold text-white relative z-10 font-['Ruslan_Display']">
          AF
        </h1>
        <p className='text-lg text-gray-300 relative z-10'>AdFriend</p>

        <button
          onClick={toggleExtension}
          className={`relative z-10 mt-6 flex items-center justify-center w-16 h-16 rounded-full border-2 border-white transition-all ${
            isOn
              ? `${themeColor}-500 text-white shadow-lg shadow-${themeColor}-500`
              : 'bg-black text-gray-400'
          }`}
        >
          <Power size={32} />
        </button>
      </div>

      <button
        onClick={toggleWhitelist}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`mt-4 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 min-w-[220px] ${
          isWhitelisted
            ? hovered
              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500'
              : 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500'
            : 'bg-black border-white text-white hover:bg-gray-700'
        }`}
      >
        {isWhitelisted ? (
          hovered ? (
            <>
              <XCircle size={24} className='text-white' />
              <span className='text-center'>Remove from Whitelist</span>
            </>
          ) : (
            <>
              <CheckCircle size={24} className='text-white' />
              <span className='text-center'>Whitelisted</span>
            </>
          )
        ) : (
          <>
            <CheckCircle size={24} className='text-white' />
            <span className='text-center'>Whitelist this site</span>
          </>
        )}
      </button>

      <div className='flex items-center space-x-2 mt-6 text-white text-lg font-bold'>
        <ShieldCheck size={28} className='text-green-400' />
        <span>Ads Blocked: {adsBlocked}</span>
      </div>
    </div>
  );
}
