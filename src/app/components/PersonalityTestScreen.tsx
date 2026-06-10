import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Sparkles, ChevronLeft } from 'lucide-react';

interface PersonalityTestScreenProps {
  onComplete: (results: PersonalityResults) => void;
  onBack: () => void;
}

export interface PersonalityResults {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

const questions = [
  {
    id: 1,
    text: "I enjoy exploring new ideas and learning about different topics.",
    trait: 'openness' as keyof PersonalityResults,
    reverse: false
  },
  {
    id: 2,
    text: "I prefer to stick to familiar routines rather than try new experiences.",
    trait: 'openness' as keyof PersonalityResults,
    reverse: true
  },
  {
    id: 3,
    text: "I'm organized and like to plan things in advance.",
    trait: 'conscientiousness' as keyof PersonalityResults,
    reverse: false
  },
  {
    id: 4,
    text: "I often leave tasks until the last minute.",
    trait: 'conscientiousness' as keyof PersonalityResults,
    reverse: true
  },
  {
    id: 5,
    text: "I feel energized when I'm around other people.",
    trait: 'extraversion' as keyof PersonalityResults,
    reverse: false
  },
  {
    id: 6,
    text: "I prefer spending time alone rather than in large groups.",
    trait: 'extraversion' as keyof PersonalityResults,
    reverse: true
  },
  {
    id: 7,
    text: "I go out of my way to help others and show kindness.",
    trait: 'agreeableness' as keyof PersonalityResults,
    reverse: false
  },
  {
    id: 8,
    text: "I tend to prioritize my own needs over others' feelings.",
    trait: 'agreeableness' as keyof PersonalityResults,
    reverse: true
  },
  {
    id: 9,
    text: "I often feel worried or anxious about things.",
    trait: 'neuroticism' as keyof PersonalityResults,
    reverse: false
  },
  {
    id: 10,
    text: "I remain calm and composed even in stressful situations.",
    trait: 'neuroticism' as keyof PersonalityResults,
    reverse: true
  }
];

export function PersonalityTestScreen({ onComplete, onBack }: PersonalityTestScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(0));

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const scores: PersonalityResults = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    questions.forEach((question, index) => {
      const answer = answers[index];
      const score = question.reverse ? 6 - answer : answer;
      scores[question.trait] += score;
    });

    // Each trait has 2 questions, scores range from 2-10, normalize to 0-100
    Object.keys(scores).forEach((key) => {
      scores[key as keyof PersonalityResults] = ((scores[key as keyof PersonalityResults] - 2) / 8) * 100;
    });

    onComplete(scores);
  };

  const currentQ = questions[currentQuestion];
  const hasAnswered = answers[currentQuestion] > 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-cyan-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-slate-900">Personality Test</h2>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-6 py-8">
        <Card className="border-purple-200 bg-white p-6 mb-6">
          <p className="text-slate-900 text-lg text-center leading-relaxed">
            {currentQ.text}
          </p>
        </Card>

        {/* Answer Options */}
        <div className="space-y-3">
          <p className="text-slate-600 text-center text-sm mb-4">
            How much do you agree with this statement?
          </p>
          
          {[
            { value: 5, label: 'Strongly Agree', color: 'bg-purple-600 hover:bg-purple-700' },
            { value: 4, label: 'Agree', color: 'bg-purple-500 hover:bg-purple-600' },
            { value: 3, label: 'Neutral', color: 'bg-slate-400 hover:bg-slate-500' },
            { value: 2, label: 'Disagree', color: 'bg-slate-500 hover:bg-slate-600' },
            { value: 1, label: 'Strongly Disagree', color: 'bg-slate-600 hover:bg-slate-700' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full p-4 rounded-lg text-white transition-all ${
                answers[currentQuestion] === option.value
                  ? `${option.color} ring-4 ring-purple-200 shadow-lg scale-105`
                  : `${option.color} opacity-70 hover:opacity-100`
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-slate-200 p-6 space-y-3">
        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="flex-1 border-slate-300 text-slate-700"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={`flex-1 ${
              hasAnswered
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
          </Button>
        </div>
        {!hasAnswered && (
          <p className="text-sm text-slate-500 text-center">
            Please select an answer to continue
          </p>
        )}
      </div>
    </div>
  );
}
