"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, GraduationCap } from "lucide-react";

interface SortingHatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHouseAssigned: (house: string) => void;
}

const questions = [
  "What quality do you value most?",
  "What would you do if you found a lost item?",
  "What kind of adventure excites you most?",
  "How do you prefer to solve problems?",
  "What's your ideal way to spend a weekend?"
];

const answerOptions = [
  ["Bravery and courage", "Wisdom and knowledge", "Loyalty and fairness", "Ambition and cunning"],
  ["Return it immediately", "Study it first", "Ask around for the owner", "Keep it if no one claims it"],
  ["Fighting dark forces", "Exploring ancient ruins", "Helping others", "Achieving personal goals"],
  ["Face them head-on", "Research and plan", "Ask for help", "Find the most efficient way"],
  ["Training for challenges", "Reading and learning", "Spending time with friends", "Working on personal projects"]
];

export default function SortingHatModal({ isOpen, onClose, onHouseAssigned }: SortingHatModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [assignedHouse, setAssignedHouse] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      performSorting(newAnswers);
    }
  };

  const performSorting = async (finalAnswers: string[]) => {
    setIsSorting(true);
    
    try {
      const prompt = `Based on these answers to the Sorting Hat questions, determine which house this person belongs to:
      
Questions and Answers:
${questions.map((q, i) => `${i + 1}. ${q} - ${finalAnswers[i]}`).join('\n')}

Please respond with ONLY the house name: GRYFFINDOR, RAVENCLAW, HUFFLEPUFF, or SLYTHERIN.`;

      const response = await fetch('/api/gpt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: 'sorting_hat' }),
      });

      const data = await response.json();
      const house = data.text.trim().toUpperCase();
      
      setAssignedHouse(house);
      onHouseAssigned(house);
    } catch (error) {
      console.error('Error during sorting:', error);
      // Fallback to random house
      const houses = ['GRYFFINDOR', 'RAVENCLAW', 'HUFFLEPUFF', 'SLYTHERIN'];
      const randomHouse = houses[Math.floor(Math.random() * houses.length)];
      setAssignedHouse(randomHouse);
      onHouseAssigned(randomHouse);
    }
  };

  const resetSorting = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsSorting(false);
    setAssignedHouse(null);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md parchment-bg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-magical">
                            <GraduationCap className="w-6 h-6" />
            The Sorting Hat
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isSorting && !assignedHouse && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">
                  {questions[currentQuestion]}
                </h3>
                
                <div className="space-y-3">
                  {answerOptions[currentQuestion].map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start parchment-card hover:magical-glow"
                      onClick={() => handleAnswer(answer)}
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </motion.div>
          )}

          {isSorting && (
            <motion.div
              key="sorting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="sparkle">
                <Sparkles className="w-12 h-12 mx-auto text-yellow-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold">The Sorting Hat is thinking...</h3>
              <p className="text-gray-600">Hmm... difficult, very difficult...</p>
            </motion.div>
          )}

          {assignedHouse && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className={`${getHouseColor(assignedHouse)} p-6 rounded-lg text-white`}>
                <div className={`house-crest ${getHouseCrest(assignedHouse)} mx-auto mb-4`} />
                <h2 className="text-2xl font-bold mb-2">{assignedHouse}</h2>
                <p className="text-sm opacity-90">
                  {assignedHouse === 'GRYFFINDOR' && 'Where dwell the brave at heart, their daring, nerve, and chivalry set Gryffindors apart.'}
                  {assignedHouse === 'SLYTHERIN' && 'Or perhaps in Slytherin, you\'ll make your real friends, those cunning folk use any means to achieve their ends.'}
                  {assignedHouse === 'RAVENCLAW' && 'Or yet in wise old Ravenclaw, if you\'ve a ready mind, where those of wit and learning will always find their kind.'}
                  {assignedHouse === 'HUFFLEPUFF' && 'You might belong in Hufflepuff, where they are just and loyal, those patient Hufflepuffs are true and unafraid of toil.'}
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={onClose} className="w-full">
                  Begin Your Journey
                </Button>
                <Button variant="outline" onClick={resetSorting} className="w-full">
                  Sort Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
} 