import './App.css'
import { useState } from "react";
import Home from './components/Home';
import Settings from './components/Settings';
import Header from './components/Header';

function App() {
   const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "settings":
        return <Settings />;

      default:
        return <Home />;
    }
  };

  return (
    <div className="w-[400px] h-[600px] flex flex-col items-center justify-between  text-white">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Body */}
      <main className="flex-grow flex items-center justify-center text-center p-4 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="w-full p-4 text-center bg-white/10 backdrop-blur-lg shadow-md border border-white/20 text-sm opacity-80">
        <p>&copy; 2025 AdFriend. All rights reserved.</p>
      </footer>
    </div>
  
  )
}

export default App
