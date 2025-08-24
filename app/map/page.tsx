"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Map from "@/components/Map/Map";

export default function MapPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWallet, setCurrentWallet] = useState<string | undefined>();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings");
      const data = await response.json();
      
      // Check if the response is an error object
      if (data.error) {
        console.error("API Error:", data.error);
        setListings([]);
      } else {
        // Ensure data is an array
        setListings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setListings(prev =>
          prev.map(listing =>
            listing.id === id ? { ...listing, status } : listing
          )
        );
      }
    } catch (error) {
      console.error("Error updating listing status:", error);
    }
  };

  const handlePointsAwarded = async (points: number) => {
    if (!currentWallet) return;

    try {
      await fetch("/api/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: currentWallet,
          points,
          action: "spell_cast",
        }),
      });
    } catch (error) {
      console.error("Error awarding points:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading the Marauder's Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">The Marauder's Map</h1>
          <p className="text-gray-600">
            Discover magical properties and plan your tours
          </p>
        </div>

        <Map
          listings={listings}
          currentWallet={currentWallet}
          onStatusChange={handleStatusChange}
          onPointsAwarded={handlePointsAwarded}
        />
      </motion.div>
    </div>
  );
} 