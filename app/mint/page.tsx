"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Upload, MapPin } from "lucide-react";

type MintFormData = {
  title: string;
  price: string;
  address: string;
  desc: string;
  house: string;
};

export default function MintPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MintFormData>();

  const watchedTitle = watch("title");
  const watchedPrice = watch("price");
  const watchedAddress = watch("address");

  const generateMagicalDescription = async () => {
    if (!watchedTitle || !watchedPrice || !watchedAddress) {
      alert("Please fill in title, price, and address first");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Create a magical real estate description for this property:
Title: ${watchedTitle}
Price: ${watchedPrice} Galleons
Address: ${watchedAddress}

Make it enchanting and magical, mentioning magical features, nearby magical locations, or enchanted amenities. Keep it under 200 words and make it sound like it belongs in the wizarding world.`;

      const response = await fetch("/api/gpt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "property_description" }),
      });

      const data = await response.json();
      setValue("desc", data.text);
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate magical description");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleAddressSearch = async () => {
    const address = watchedAddress;
    if (!address) return;

    try {
      // This would typically use Google Places API
      // For demo purposes, we'll use a simple geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
  };

  const onSubmit = async (data: MintFormData) => {
    try {
      const listingData = {
        ...data,
        price: parseInt(data.price),
        lat: coordinates.lat,
        lng: coordinates.lng,
        images: JSON.stringify(images),
        owner: "0x1234567890123456789012345678901234567890", // This would be the connected wallet
      };

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      if (response.ok) {
        alert("Property listed successfully! 🏠✨");
        // Reset form
        setValue("title", "");
        setValue("price", "");
        setValue("address", "");
        setValue("desc", "");
        setValue("house", "");
        setImages([]);
        setCoordinates({ lat: 0, lng: 0 });
      } else {
        alert("Failed to list property");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="parchment-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wand2 className="w-6 h-6 text-purple-600" />
              Mint New Property
            </CardTitle>
            <p className="text-gray-600">
              Create a magical real estate listing and mint it as an NFT
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Title</label>
                  <Input
                    {...register("title")}
                    placeholder="Enchanted Cottage"
                    className="parchment-bg"
                                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (Galleons)</label>
                  <Input
                    {...register("price")}
                    type="number"
                    placeholder="1000"
                    className="parchment-bg"
                                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <div className="flex gap-2">
                  <Input
                    {...register("address")}
                    placeholder="123 Diagon Alley, London"
                    className="parchment-bg flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddressSearch}
                    className="flex items-center gap-1"
                  >
                    <MapPin className="w-4 h-4" />
                    Find
                  </Button>
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
                {coordinates.lat !== 0 && (
                  <p className="text-green-600 text-sm mt-1">
                    Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* House Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">House</label>
                <Select onValueChange={(value) => setValue("house", value)}>
                  <SelectTrigger className="parchment-bg">
                    <SelectValue placeholder="Select your house" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GRYFFINDOR">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full" />
                        Gryffindor
                      </div>
                    </SelectItem>
                    <SelectItem value="SLYTHERIN">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-800 to-gray-600 rounded-full" />
                        Slytherin
                      </div>
                    </SelectItem>
                    <SelectItem value="RAVENCLAW">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-900 to-yellow-700 rounded-full" />
                        Ravenclaw
                      </div>
                    </SelectItem>
                    <SelectItem value="HUFFLEPUFF">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-gray-800 rounded-full" />
                        Hufflepuff
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Description</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateMagicalDescription}
                    disabled={isGenerating}
                    className="flex items-center gap-1"
                  >
                    {isGenerating ? (
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate Magical Copy
                  </Button>
                </div>
                <Textarea
                  {...register("desc")}
                  placeholder="Describe your magical property..."
                  rows={4}
                  className="parchment-bg"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-800">
                      Click to upload images
                    </span>
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                size="lg"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Mint Property NFT
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 