import { useState, useEffect } from "react";
import { Power, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function Home() {
  const { themeColor } = useTheme();
  const [isOn, setIsOn] = useState(() => JSON.parse(localStorage.getItem("isOn")) ?? true);
  const [adsBlocked, setAdsBlocked] = useState(() => JSON.parse(localStorage.getItem("adsBlocked")) || 0);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Get current site URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.hostname);
    }
  }, []);

  // Check if the current site is in the whitelist
  useEffect(() => {
    const storedWhitelist = JSON.parse(localStorage.getItem("whitelist")) || [];
    setIsWhitelisted(storedWhitelist.includes(currentUrl));
  }, [currentUrl]);

  // Persist `isOn` state
  useEffect(() => {
    localStorage.setItem("isOn", JSON.stringify(isOn));
    console.log(`AdFriend is ${isOn ? "ON" : "OFF"}`);
  }, [isOn]);

  // Persist `adsBlocked`
  useEffect(() => {
    localStorage.setItem("adsBlocked", JSON.stringify(adsBlocked));
  }, [adsBlocked]);

  // Handle whitelisting
  const toggleWhitelist = () => {
    let storedWhitelist = JSON.parse(localStorage.getItem("whitelist")) || [];

    if (isWhitelisted) {
      storedWhitelist = storedWhitelist.filter((site) => site !== currentUrl);
    } else {
      storedWhitelist.push(currentUrl);
    }

    localStorage.setItem("whitelist", JSON.stringify(storedWhitelist));
    setIsWhitelisted(!isWhitelisted);
  };

  return (
    <div className="absolute inset-0 flex flex-col gap-10 justify-center items-center p-8">
      {/* Glowing Effect */}
      {isOn && <div className={`w-48 h-48 rounded-full bg-${themeColor}-500 opacity-30 animate-pulse absolute blur-3xl`}></div>}

      {/* AF Text */}
      <h1 className="text-6xl font-bold text-white relative z-10 font-['Ruslan_Display']">AF</h1>
      <p className="text-lg text-gray-300 relative z-10">AdFriend</p>

      {/* Power Button */}
      <button
        onClick={() => setIsOn((prev) => !prev)}
        className={`relative z-10 mt-6 flex items-center justify-center w-16 h-16 rounded-full border-2 border-white transition-all ${
          isOn ? `${themeColor}-500 text-white shadow-lg shadow-${themeColor}-500` : "bg-black text-gray-400"
        }`}
      >
        <Power size={32} />
      </button>

      {/* Whitelist Button */}
      <button
        onClick={toggleWhitelist}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`mt-4 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 min-w-[220px] ${
          isWhitelisted
            ? hovered
              ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500" // Red when hovered
              : "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500" // Green when whitelisted
            : "bg-black border-white text-white hover:bg-gray-700" // Default when not whitelisted
        }`}
      >
        {isWhitelisted ? (
          hovered ? (
            <>
              <XCircle size={24} className="text-white" />
              <span className="text-center">Remove from Whitelist</span>
            </>
          ) : (
            <>
              <CheckCircle size={24} className="text-white" />
              <span className="text-center">Whitelisted</span>
            </>
          )
        ) : (
          <>
            <CheckCircle size={24} className="text-white" />
            <span className="text-center">Whitelist this site</span>
          </>
        )}
      </button>

      {/* Stats: Ads Blocked */}
      <div className="flex items-center space-x-2 mt-6 text-white text-lg font-bold">
        <ShieldCheck size={28} className="text-green-400" />
        <span>Ads Blocked: {adsBlocked}</span>
      </div>
    </div>
  );
}
