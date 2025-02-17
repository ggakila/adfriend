/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

export default function Settings() {
  const { themeColor, setThemeColor } = useTheme();
  const [settings, setSettings] = useState({
    enabled: true,
    disabledSites: [],
    selectedCategories: ['Textures'],
    adsLimit: 'No Limit',
    colorThemes: 'purple',
  });

  // Load settings from storage
  useEffect(() => {
    chrome.storage.local.get('settings', (data) => {
      if (data.settings) {
        setSettings(data.settings);
        setThemeColor(data.settings.colorThemes);
      }
    });
  }, []);

  // Update storage whenever settings change
  useEffect(() => {
    chrome.storage.local.set({ settings }, () => {
      console.log('Updated settings:', settings);
    });
  }, [settings]);

  const categories = [
    'MEMES',
    'Motivation',
    'Jokes',
    'Textures',
    'Nature',
    'Landscapes',
    'Art',
    'Animals',
    'Cars',
  ];

  const colors = {
    red: 'bg-red-500 border-red-500 shadow-red-500 hover:bg-red-600 hover:shadow-red-600',
    green:
      'bg-green-500 border-green-500 shadow-green-500 hover:bg-green-600 hover:shadow-green-600',
    purple:
      'bg-purple-500 border-purple-500 shadow-purple-500 hover:bg-purple-600 hover:shadow-purple-600',
    blue: 'bg-blue-500 border-blue-500 shadow-blue-500 hover:bg-blue-600 hover:shadow-blue-600',
    pink: 'bg-pink-500 border-pink-500 shadow-pink-500 hover:bg-pink-600 hover:shadow-pink-600',
  };

  const toggleCategory = (category) => {
    setSettings((prevSettings) => {
      const newCategories = prevSettings.selectedCategories.includes(category)
        ? prevSettings.selectedCategories.filter((c) => c !== category)
        : [...prevSettings.selectedCategories, category];
      return { ...prevSettings, selectedCategories: newCategories };
    });
  };

  return (
    <div className='flex flex-col items-center justify-between'>
      {/* Category Selection */}
      <div className='flex flex-col gap-5'>
        <h2 className='text-lg font-bold text-white'>
          Select categories of ads to see:
        </h2>
        <div className='grid grid-cols-3 gap-4 mt-2 mb-8'>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-lg text-white border-2 transition-all shadow-md transform hover:scale-105 ${
                settings.selectedCategories.includes(category)
                  ? colors[themeColor]
                  : 'bg-black border-white hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Ad Limit Selector */}
      <div className='mt-4'>
        <h2 className='text-lg font-bold text-white'>
          Select the number of ads to see:
        </h2>
        <select
          value={settings.adsLimit}
          onChange={(e) =>
            setSettings({ ...settings, adsLimit: e.target.value })
          }
          className='mt-2 px-4 py-2 rounded-lg border-2 text-white bg-black border-white hover:border-purple-400 cursor-pointer transition-all'
        >
          {[...Array(10).keys()].map((n) => (
            <option key={n + 1} value={n + 1}>
              {n + 1}
            </option>
          ))}
          <option value='No Limit'>No Limit</option>
        </select>
      </div>

      {/* Theme Selector */}
      <div className='mt-6 text-center'>
        <h2 className='text-lg font-bold text-white'>Select Theme Color:</h2>
        <div className='flex justify-center space-x-4 mt-2'>
          {Object.keys(colors).map((color) => (
            <button
              key={color}
              onClick={() => {
                setSettings({ ...settings, colorThemes: color });
                setThemeColor(color);
              }}
              className={`w-10 h-10 rounded-full ${
                colors[color]
              } border-2 transition-all transform hover:scale-110 ${
                themeColor === color ? 'border-white' : 'border-transparent'
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
