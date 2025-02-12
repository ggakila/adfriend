import './App.css'
import { useState } from "react";

function App() {
   const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="text-white text-lg space-y-6">
            <h2 className="text-4xl font-bold">Welcome to AdFriend!</h2>
            <p className="text-lg opacity-80">Discover new features and manage your ads efficiently.</p>
            
            {/* Quick Stats or Features */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md border border-white/20">
                <h3 className="font-semibold">Ad Tracking</h3>
                <p className="text-sm">Monitor your ad performance in real-time.</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md border border-white/20">
                <h3 className="font-semibold">Performance Analytics</h3>
                <p className="text-sm">Gain insights to optimize your ad campaigns.</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md border border-white/20">
                <h3 className="font-semibold">Automated Management</h3>
                <p className="text-sm">Save time with AI-powered ad optimization.</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-md border border-white/20">
                <h3 className="font-semibold">User Insights</h3>
                <p className="text-sm">Understand your audience better.</p>
              </div>
            </div>
            
            {/* CTA */}
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:opacity-90 transition">Get Started</button>
          </div>
        );
      case "features":
        return <p className="text-white text-lg opacity-80">Explore our powerful tools designed to optimize your ad experience.</p>;
      case "settings":
        return <p className="text-white text-lg opacity-80">Adjust your preferences and personalize your experience.</p>;
      case "myads":
        return <p className="text-white text-lg opacity-80">Manage, track, and analyze your advertisements in one place.</p>;
      default:
        return <p className="text-white text-lg opacity-80">Welcome to AdFriend!</p>;
    }
  };

  return (
    <div className="w-[800px] h-[600px] flex flex-col items-center justify-between p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl border border-white/10 text-white">
      {/* Header */}
      <header className="w-full flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg shadow-md rounded-lg border border-white/20">
        <h1 className="text-2xl font-bold">AdFriend</h1>
        <nav>
          <ul className="flex space-x-6 font-medium">
            <li><button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "text-blue-400" : "hover:text-blue-300"}>Home</button></li>
            <li><button onClick={() => setActiveTab("features")} className={activeTab === "features" ? "text-blue-400" : "hover:text-blue-300"}>Features</button></li>
            <li><button onClick={() => setActiveTab("settings")} className={activeTab === "settings" ? "text-blue-400" : "hover:text-blue-300"}>Settings</button></li>
            <li><button onClick={() => setActiveTab("myads")} className={activeTab === "myads" ? "text-blue-400" : "hover:text-blue-300"}>My Ads</button></li>
          </ul>
        </nav>
      </header>
      
      {/* Body */}
      <main className="flex-grow flex items-center justify-center text-center p-4 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="w-full p-4 text-center bg-white/10 backdrop-blur-lg shadow-md rounded-lg border border-white/20 text-sm opacity-80">
        <p>&copy; 2025 AdFriend. All rights reserved.</p>
      </footer>
    </div>
  
  )
}

export default App
