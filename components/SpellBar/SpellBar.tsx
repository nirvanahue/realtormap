"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Eye, EyeOff, Trash2, Key } from "lucide-react";
import { castSpellToggle, castSpellSold } from "@/lib/spells";

interface SpellBarProps {
  tokenId: string;
  currentStatus: string;
  onStatusChange: (status: string) => void;
  onPointsAwarded: (points: number) => void;
}

export default function SpellBar({ 
  tokenId, 
  currentStatus, 
  onStatusChange, 
  onPointsAwarded 
}: SpellBarProps) {
  const [isCasting, setIsCasting] = useState<string | null>(null);

  const castSpell = async (spell: string) => {
    setIsCasting(spell);
    
    try {
      const tokenIdBigInt = BigInt(tokenId);
      
      switch (spell) {
        case 'lumos':
          await castSpellToggle(tokenIdBigInt, true);
          onStatusChange('VISIBLE');
          onPointsAwarded(5);
          break;
          
        case 'nox':
          await castSpellToggle(tokenIdBigInt, false);
          onStatusChange('HIDDEN');
          onPointsAwarded(5);
          break;
          
        case 'evanesco':
          await castSpellSold(tokenIdBigInt);
          onStatusChange('SOLD');
          onPointsAwarded(50);
          break;
          
        case 'alohomora':
          // This would typically open a transfer modal or redirect to wallet
          window.open(`https://opensea.io/assets/polygon/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}/${tokenId}`, '_blank');
          break;
      }
    } catch (error) {
      console.error(`Error casting ${spell}:`, error);
      alert(`Failed to cast ${spell} spell. Please try again.`);
    } finally {
      setIsCasting(null);
    }
  };

  const spells = [
    {
      name: 'Lumos',
      icon: Eye,
      spell: 'lumos',
      description: 'Make property visible',
      disabled: currentStatus === 'VISIBLE',
      className: 'spell-lumos'
    },
    {
      name: 'Nox',
      icon: EyeOff,
      spell: 'nox',
      description: 'Hide property',
      disabled: currentStatus === 'HIDDEN',
      className: 'spell-nox'
    },
    {
      name: 'Evanesco',
      icon: Trash2,
      spell: 'evanesco',
      description: 'Mark as sold',
      disabled: currentStatus === 'SOLD',
      className: 'spell-evanesco'
    },
    {
      name: 'Alohomora',
      icon: Key,
      spell: 'alohomora',
      description: 'Transfer ownership',
      disabled: false,
      className: 'spell-alohomora'
    }
  ];

  return (
    <div className="parchment-card magical-glow">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="font-semibold text-lg">Spell Bar</h3>
        <Badge variant="secondary" className="ml-auto">
          {currentStatus}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {spells.map((spell) => (
          <motion.div
            key={spell.spell}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className={`spell-button ${spell.className} w-full h-16 flex flex-col items-center justify-center gap-1`}
              disabled={spell.disabled || isCasting === spell.spell}
              onClick={() => castSpell(spell.spell)}
            >
              {isCasting === spell.spell ? (
                <div className="animate-spin">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : (
                <spell.icon className="w-4 h-4" />
              )}
              <span className="text-xs font-bold">{spell.name}</span>
              <span className="text-xs opacity-75">{spell.description}</span>
            </Button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>Points awarded: Lumos/Nox (+5), Evanesco (+50)</p>
      </div>
    </div>
  );
} 