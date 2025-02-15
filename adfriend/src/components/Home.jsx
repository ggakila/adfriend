import { useState, useEffect } from "react";
import { Power, CheckCircle, ShieldCheck } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function Home() {
  const { themeColor } = useTheme();
  const [isOn, setIsOn] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [adsBlocked, setAdsBlocked] = useState(0);

  useEffect(() => {
    if (isOn) {
      const interval = setInterval(() => {
        setAdsBlocked((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOn]);

  const themeClasses = {
    red: "bg-red-500 text-red-400 shadow-red-500 hover:bg-red-600 hover:shadow-red-600",
    green: "bg-green-500 text-green-400 shadow-green-500 hover:bg-green-600 hover:shadow-green-600",
    purple: "bg-purple-500 text-purple-400 shadow-purple-500 hover:bg-purple-600 hover:shadow-purple-600",
    blue: "bg-blue-500 text-blue-400 shadow-blue-500 hover:bg-blue-600 hover:shadow-blue-600",
    pink: "bg-pink-500 text-pink-400 shadow-pink-500 hover:bg-pink-600 hover:shadow-pink-600",
  };

  return (
    <div className="absolute inset-0 flex flex-col gap-10 justify-center items-center p-8">
      <div className="relative flex flex-col items-center justify-center">
        {/* Glowing Effect */}
        {isOn && (
          <div className={`w-48 h-48 rounded-full opacity-30 animate-pulse absolute blur-3xl ${themeClasses[themeColor]}`}></div>
        )}

        {/* AF Text */}
        <h1 className="text-6xl font-bold text-white relative z-10 font-['Ruslan_Display']">AF</h1>
        <p className="text-lg text-gray-300 relative z-10">AdFriend</p>

        {/* Power Button */}
        <button
          onClick={() => setIsOn(!isOn)}
          className={`relative z-10 mt-6 flex items-center justify-center w-16 h-16 rounded-full border-2 border-white transition-all transform hover:scale-110 ${
            isOn ? `${themeClasses[themeColor]} shadow-lg` : "bg-black text-gray-400"
          }`}
        >
          <Power size={32} />
        </button>
      </div>

      {/* Whitelist Button */}
      <button
        onClick={() => setIsWhitelisted(!isWhitelisted)}
        className={`mt-4 flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all transform hover:scale-105 ${
          isWhitelisted ? `bg-green-500 border-green-500 text-white shadow-lg shadow-green-500` : "bg-black border-white text-white hover:bg-gray-800"
        }`}
      >
        <CheckCircle size={24} className={isWhitelisted ? "text-white" : "text-gray-400"} />
        <span>Whitelist this site</span>
      </button>

      {/* Stats: Ads Blocked */}
      <div className="flex items-center space-x-2 mt-6 text-white text-lg font-bold">
        <ShieldCheck size={28} className="text-green-400" />
        <span className="hover:text-green-300 hover:scale-105 transition-all">Ads Blocked: {adsBlocked}</span>
      </div>
    </div>
  );
}
