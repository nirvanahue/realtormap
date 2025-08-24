"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Map, 
  Plus, 
  Trophy, 
  Wallet, 
  Sparkles,
  GraduationCap 
} from "lucide-react";
import SortingHatModal from "@/components/SortingHatModal/SortingHatModal";

export function Navigation() {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<string>("");
  const [userHouse, setUserHouse] = useState<string>("");
  const [showSortingHat, setShowSortingHat] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // Check if user has been sorted before
    const savedHouse = localStorage.getItem("userHouse");
    const savedWallet = localStorage.getItem("userWallet");
    
    if (savedHouse && savedWallet) {
      setUserHouse(savedHouse);
      setCurrentWallet(savedWallet);
      setIsConnected(true);
      fetchUserPoints(savedWallet);
    }
  }, []);

  const fetchUserPoints = async (address: string) => {
    try {
      const response = await fetch(`/api/agent/${address}`);
      if (response.ok) {
        const agent = await response.json();
        setUserPoints(agent.points);
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
    }
  };

  const connectWallet = () => {
    // Simulate wallet connection
    const mockWallet = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setCurrentWallet(mockWallet);
    setIsConnected(true);
    localStorage.setItem("userWallet", mockWallet);
    
    // Show sorting hat if user hasn't been sorted
    if (!localStorage.getItem("userHouse")) {
      setShowSortingHat(true);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setCurrentWallet("");
    setUserHouse("");
    setUserPoints(0);
    localStorage.removeItem("userWallet");
    localStorage.removeItem("userHouse");
  };

  const handleHouseAssigned = (house: string) => {
    setUserHouse(house);
    localStorage.setItem("userHouse", house);
    
    // Create agent record
    fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: currentWallet,
        house: house,
      }),
    });
  };

  const getHouseColor = (house: string) => {
    switch (house) {
      case 'GRYFFINDOR': return 'bg-gradient-to-r from-red-600 to-yellow-500';
      case 'SLYTHERIN': return 'bg-gradient-to-r from-green-800 to-gray-600';
      case 'RAVENCLAW': return 'bg-gradient-to-r from-blue-900 to-yellow-700';
      case 'HUFFLEPUFF': return 'bg-gradient-to-r from-yellow-400 to-gray-800';
      default: return 'bg-gray-600';
    }
  };

  const getHouseCrest = (house: string) => {
    return `crest-${house.toLowerCase()}`;
  };

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/map", label: "Map", icon: Map },
    { href: "/mint", label: "Mint", icon: Plus },
    { href: "/dashboard", label: "Dashboard", icon: Trophy },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Realty Marauders</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Wallet Connection & User Info */}
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="flex items-center gap-3">
                  {/* House Badge */}
                  {userHouse && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Badge className={`${getHouseColor(userHouse)} text-white`}>
                        <div className={`house-crest ${getHouseCrest(userHouse)}`} />
                        {userHouse}
                      </Badge>
                      <Badge variant="outline">
                        {userPoints} pts
                      </Badge>
                    </motion.div>
                  )}
                  
                  {/* Wallet Address */}
                  <div className="hidden sm:block text-sm text-gray-600">
                    {currentWallet.slice(0, 6)}...{currentWallet.slice(-4)}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  className="flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sorting Hat Modal */}
      <SortingHatModal
        isOpen={showSortingHat}
        onClose={() => setShowSortingHat(false)}
        onHouseAssigned={handleHouseAssigned}
      />
    </>
  );
} 