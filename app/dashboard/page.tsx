"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, TrendingUp, Crown } from "lucide-react";

interface Agent {
  address: string;
  house: string;
  points: number;
}

interface HouseTotals {
  [key: string]: number;
}

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [houseTotals, setHouseTotals] = useState<HouseTotals>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch leaderboard
      const leaderboardResponse = await fetch("/api/leaderboard");
      const leaderboardData = await leaderboardResponse.json();
      setAgents(leaderboardData);

      // Fetch house totals
      const houseTotalsResponse = await fetch("/api/house-totals");
      const houseTotalsData = await houseTotalsResponse.json();
      setHouseTotals(houseTotalsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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

  const getLeadingHouse = () => {
    const entries = Object.entries(houseTotals);
    if (entries.length === 0) return null;
    
    return entries.reduce((a, b) => a[1] > b[1] ? a : b);
  };

  const leadingHouse = getLeadingHouse();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading the Great Hall...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Great Hall Dashboard</h1>
          <p className="text-gray-600">
            House points and agent rankings
          </p>
        </div>

        {/* House Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(houseTotals).map(([house, points]) => (
            <motion.div
              key={house}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Card className={`${getHouseColor(house)} text-white overflow-hidden`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`house-crest ${getHouseCrest(house)}`} />
                    <CardTitle className="text-lg">{house}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{points}</div>
                  <p className="text-sm opacity-90">House Points</p>
                  {leadingHouse && house === leadingHouse[0] && (
                    <div className="absolute top-2 right-2">
                      <Crown className="w-6 h-6 text-yellow-300" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* House Cup Winner */}
        {leadingHouse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
              <CardContent className="pt-6">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  House Cup Winner: {leadingHouse[0]}
                </h2>
                <p className="text-lg">
                  {leadingHouse[1]} points
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top Agents Leaderboard */}
        <Card className="parchment-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              Top Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">
                        {agent.address.slice(0, 6)}...{agent.address.slice(-4)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${getHouseColor(agent.house).split(' ')[0]}`} />
                        <span className="text-sm text-gray-600">{agent.house}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-bold">{agent.points} pts</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="parchment-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{agents.length}</div>
                <p className="text-sm text-gray-600">Total Agents</p>
              </div>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">
                  {Object.values(houseTotals).reduce((a, b) => a + b, 0)}
                </div>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">
                  {agents.length > 0 ? Math.round(agents[0].points / 10) : 0}
                </div>
                <p className="text-sm text-gray-600">Avg Points/Agent</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
} 