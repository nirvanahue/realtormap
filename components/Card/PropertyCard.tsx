"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign, Home, Sparkles } from "lucide-react";
import SpellBar from "@/components/SpellBar/SpellBar";

interface PropertyCardProps {
  listing: {
    id: string;
    tokenId?: string;
    title: string;
    desc: string;
    price: number;
    status: string;
    lat: number;
    lng: number;
    house: string;
    images: string;
    owner: string;
  };
  currentWallet?: string;
  isOwner: boolean;
  onStatusChange: (id: string, status: string) => void;
  onPointsAwarded: (points: number) => void;
  onAddToTour: (listing: any) => void;
  onRemoveFromTour: (id: string) => void;
  isInTour: boolean;
}

export default function PropertyCard({
  listing,
  currentWallet,
  isOwner,
  onStatusChange,
  onPointsAwarded,
  onAddToTour,
  onRemoveFromTour,
  isInTour
}: PropertyCardProps) {
  const [showSpellBar, setShowSpellBar] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = JSON.parse(listing.images || '[]');
  const currentImage = images[currentImageIndex] || '/placeholder-house.jpg';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VISIBLE': return 'bg-green-500';
      case 'HIDDEN': return 'bg-yellow-500';
      case 'SOLD': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTourToggle = () => {
    if (isInTour) {
      onRemoveFromTour(listing.id);
    } else {
      onAddToTour(listing);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="parchment-card magical-glow"
    >
      <Card className="overflow-hidden">
        <CardHeader className={`${getHouseColor(listing.house)} text-white p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`house-crest ${getHouseCrest(listing.house)}`} />
              <CardTitle className="text-lg">{listing.title}</CardTitle>
            </div>
            <Badge className={getStatusColor(listing.status)}>
              {listing.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Image Carousel */}
          <div className="relative mb-4">
            <img
              src={currentImage}
              alt={listing.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold">{listing.price.toLocaleString()} Galleons</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Home className="w-4 h-4" />
              <span className="text-sm">{listing.house}</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed">
              {listing.desc}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSpellBar(!showSpellBar)}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  Spells
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleTourToggle}
                className="flex items-center gap-1"
              >
                <Checkbox checked={isInTour} className="w-4 h-4" />
                {isInTour ? 'Remove from Tour' : 'Add to Tour'}
              </Button>
            </div>

            {/* Spell Bar */}
            {showSpellBar && isOwner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <SpellBar
                  tokenId={listing.tokenId || '0'}
                  currentStatus={listing.status}
                  onStatusChange={(status) => onStatusChange(listing.id, status)}
                  onPointsAwarded={onPointsAwarded}
                />
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 