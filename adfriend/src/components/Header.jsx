/* eslint-disable react/prop-types */
import { useTheme } from "../ThemeContext";

export default function Header({ activeTab, setActiveTab }) {
  const { themeColor } = useTheme();

  const themeClasses = {
    red: "text-red-400 hover:text-red-300",
    green: "text-green-400 hover:text-green-300",
    purple: "text-purple-400 hover:text-purple-300",
    blue: "text-blue-400 hover:text-blue-300",
    pink: "text-pink-400 hover:text-pink-300",
  };

  return (
    <header className="w-full flex items-center justify-between p-4 border-b z-50">
      <h1 className="text-2xl font-bold font-['Ruslan_Display']">AF</h1>
      <nav>
        <ul className="flex space-x-6 font-medium">
          <li>
            <button
              onClick={() => setActiveTab("home")}
              className={activeTab === "home" ? themeClasses[themeColor] : "text-gray-400 hover:text-gray-300"}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("settings")}
              className={activeTab === "settings" ? themeClasses[themeColor] : "text-gray-400 hover:text-gray-300"}
            >
              Settings
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
