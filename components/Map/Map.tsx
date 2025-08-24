"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Route, Clock, Sparkles, Grid, List } from "lucide-react";
import PropertyCard from "@/components/Card/PropertyCard";
import { orderTour, calculateTourDistance, estimateTourTime } from "@/lib/tsp";

interface MapProps {
  listings: any[];
  currentWallet?: string;
  onStatusChange: (id: string, status: string) => void;
  onPointsAwarded: (points: number) => void;
}

export default function Map({ listings, currentWallet, onStatusChange, onPointsAwarded }: MapProps) {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [tourListings, setTourListings] = useState<any[]>([]);
  const [showTour, setShowTour] = useState(false);
  const [tourRoute, setTourRoute] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isOwner = useCallback((listing: any) => {
    return currentWallet && listing.owner.toLowerCase() === currentWallet.toLowerCase();
  }, [currentWallet]);

  const getHouseColor = useCallback((house: string) => {
    switch (house) {
      case 'GRYFFINDOR': return '#D3A625';
      case 'SLYTHERIN': return '#1A472A';
      case 'RAVENCLAW': return '#0E1A40';
      case 'HUFFLEPUFF': return '#ECB939';
      default: return '#666666';
    }
  }, []);

  const handleListingClick = useCallback((listing: any) => {
    setSelectedListing(listing);
  }, []);

  const handleAddToTour = useCallback((listing: any) => {
    if (!tourListings.find(l => l.id === listing.id)) {
      setTourListings(prev => [...prev, listing]);
    }
  }, [tourListings]);

  const handleRemoveFromTour = useCallback((id: string) => {
    setTourListings(prev => prev.filter(l => l.id !== id));
  }, []);

  const generateTour = useCallback(() => {
    if (tourListings.length < 2) return;

    const orderedTour = orderTour(tourListings);
    setTourRoute(orderedTour);
    setShowTour(true);
    
    // Award points for tour generation
    onPointsAwarded(20);
  }, [tourListings, onPointsAwarded]);

  const tourDistance = useMemo(() => {
    if (tourRoute.length < 2) return 0;
    return calculateTourDistance(tourRoute);
  }, [tourRoute]);

  const tourTime = useMemo(() => {
    return estimateTourTime(tourDistance);
  }, [tourDistance]);

  const isInTour = useCallback((listingId: string) => {
    return tourListings.some(l => l.id === listingId);
  }, [tourListings]);

  return (
    <div className="space-y-6">
      {/* Tour Panel */}
      {tourListings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="parchment-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Route className="w-5 h-5" />
              Tour Planner ({tourListings.length} properties)
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateTour}
                disabled={tourListings.length < 2}
              >
                Generate Tour
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTourListings([])}
              >
                Clear Tour
              </Button>
            </div>
          </div>

          {showTour && tourRoute.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Route className="w-4 h-4" />
                  <span>Distance: {(tourDistance / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>ETA: {tourTime} minutes</span>
                </div>
                <Badge variant="secondary">+20 points awarded!</Badge>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tourListings.map((listing, index) => (
              <div key={listing.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                <Badge variant="outline">{index + 1}</Badge>
                <span className="text-sm font-medium">{listing.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFromTour(listing.id)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Magical Properties ({Array.isArray(listings) ? listings.length : 0})</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Properties Display */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {(Array.isArray(listings) ? listings : []).map((listing) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => handleListingClick(listing)}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                  <Badge 
                    style={{ backgroundColor: getHouseColor(listing.house), color: 'white' }}
                    className="ml-2"
                  >
                    {listing.house}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3 line-clamp-3">{listing.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    {listing.price} Galleons
                  </span>
                  <div className="flex gap-2">
                    {(isInTour(listing.id) || false) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromTour(listing.id);
                        }}
                      >
                        Remove from Tour
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToTour(listing);
                        }}
                      >
                        Add to Tour
                      </Button>
                    )}
                  </div>
                </div>
                {listing.status && listing.status !== 'VISIBLE' && (
                  <Badge variant="secondary" className="mt-2">
                    {listing.status}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Property Card */}
      {selectedListing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <PropertyCard
            listing={selectedListing}
            currentWallet={currentWallet}
            isOwner={isOwner(selectedListing)}
            onStatusChange={onStatusChange}
            onPointsAwarded={onPointsAwarded}
            onAddToTour={handleAddToTour}
            onRemoveFromTour={handleRemoveFromTour}
            isInTour={isInTour(selectedListing.id) || false}
          />
        </motion.div>
      )}
    </div>
  );
} 