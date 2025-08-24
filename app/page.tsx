"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Map, 
  Wand2, 
  Trophy, 
  Home, 
  Shield, 
  Zap, 
  Users,
  ArrowRight 
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Map,
      title: "Marauder's Map",
      description: "Interactive map with magical property markers and tour planning",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Wand2,
      title: "Magical Spells",
      description: "Cast spells to control property visibility and status",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Trophy,
      title: "House Points",
      description: "Earn points for your house through magical real estate activities",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: Shield,
      title: "NFT Ownership",
      description: "True ownership of magical properties as NFTs on blockchain",
      color: "from-green-500 to-teal-600",
    },
  ];

  const houses = [
    {
      name: "Gryffindor",
      color: "from-red-600 to-yellow-500",
      description: "Brave and courageous properties",
    },
    {
      name: "Slytherin",
      color: "from-green-800 to-gray-600",
      description: "Ambitious and cunning estates",
    },
    {
      name: "Ravenclaw",
      color: "from-blue-900 to-yellow-700",
      description: "Wise and intelligent dwellings",
    },
    {
      name: "Hufflepuff",
      color: "from-yellow-400 to-gray-800",
      description: "Loyal and fair homes",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-12 h-12 text-purple-600" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Realty Marauders
              </h1>
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Where magical real estate meets blockchain technology. 
              Discover, mint, and manage enchanted properties with the power of spells.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/map">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Map className="w-5 h-5 mr-2" />
                  Explore the Map
                </Button>
              </Link>
              <Link href="/mint">
                <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Mint Property
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Magical Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of real estate with our enchanted platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full parchment-card hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Houses Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your House</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every property belongs to a Hogwarts house. Which one will you represent?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {houses.map((house, index) => (
              <motion.div
                key={house.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className={`bg-gradient-to-r ${house.color} text-white h-full`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{house.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-white/90">{house.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Magical Journey?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Connect your wallet, get sorted into your house, and begin exploring the magical world of real estate
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/map">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Map className="w-5 h-5 mr-2" />
                  Explore Properties
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">Realty Marauders</span>
          </div>
          <p className="text-gray-400">
            Magical real estate powered by blockchain technology
          </p>
        </div>
      </footer>
    </div>
  );
}
