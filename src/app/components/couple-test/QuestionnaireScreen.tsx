import { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Answer, PartnerInfo } from './CoupleTest';

interface QuestionnaireScreenProps {
  partnerInfo: PartnerInfo;
  onComplete: (answers: Answer[]) => void;
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  category: string;
}

const questions: Question[] = [
  // Communication (5 questions)
  { id: 1, question: 'My partner and I communicate openly about our feelings', category: 'communication' },
  { id: 2, question: 'We listen to each other without interrupting or judging', category: 'communication' },
  { id: 3, question: 'I feel comfortable sharing my deepest thoughts with my partner', category: 'communication' },
  { id: 4, question: 'We regularly check in with each other about how we\'re doing', category: 'communication' },
  { id: 5, question: 'My partner understands what I mean, even when I struggle to express myself', category: 'communication' },
  
  // Conflict Resolution (5 questions)
  { id: 6, question: 'We handle disagreements in a respectful and constructive way', category: 'conflict' },
  { id: 7, question: 'After an argument, we make efforts to repair and reconnect', category: 'conflict' },
  { id: 8, question: 'We can disagree without attacking each other personally', category: 'conflict' },
  { id: 9, question: 'Conflicts bring us closer together rather than driving us apart', category: 'conflict' },
  { id: 10, question: 'We are both willing to compromise when needed', category: 'conflict' },
  
  // Emotional Intimacy (5 questions)
  { id: 11, question: 'I feel emotionally close and connected to my partner', category: 'emotional' },
  { id: 12, question: 'My partner provides emotional support when I need it', category: 'emotional' },
  { id: 13, question: 'We share our fears, hopes, and dreams with each other', category: 'emotional' },
  { id: 14, question: 'I feel understood and accepted by my partner', category: 'emotional' },
  { id: 15, question: 'We make each other feel loved and valued', category: 'emotional' },
  
  // Trust & Security (5 questions)
  { id: 16, question: 'I completely trust my partner', category: 'trust' },
  { id: 17, question: 'My partner is reliable and keeps their promises', category: 'trust' },
  { id: 18, question: 'I feel secure in our relationship', category: 'trust' },
  { id: 19, question: 'We are honest with each other, even when it\'s difficult', category: 'trust' },
  { id: 20, question: 'I don\'t worry about my partner\'s loyalty or commitment', category: 'trust' },
  
  // Shared Values (5 questions)
  { id: 21, question: 'We have similar views on important life matters', category: 'values' },
  { id: 22, question: 'Our long-term goals and dreams are compatible', category: 'values' },
  { id: 23, question: 'We share similar values about family, money, and lifestyle', category: 'values' },
  { id: 24, question: 'We support each other\'s personal growth and aspirations', category: 'values' },
  { id: 25, question: 'We have a shared vision for our future together', category: 'values' },
  
  // Physical Affection (5 questions)
  { id: 26, question: 'I am satisfied with the level of physical intimacy in our relationship', category: 'affection' },
  { id: 27, question: 'We show affection to each other regularly (hugs, kisses, touch)', category: 'affection' },
  { id: 28, question: 'Physical intimacy feels natural and comfortable between us', category: 'affection' },
  { id: 29, question: 'We are both satisfied with our romantic and sexual connection', category: 'affection' },
  { id: 30, question: 'We communicate openly about our physical and intimate needs', category: 'affection' },
];

export function QuestionnaireScreen({
  partnerInfo,
  onComplete,
  onBack,
}: QuestionnaireScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const answer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: selectedAnswer,
      category: currentQuestion.category,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // All questions completed
      onComplete(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Load previous answer
      const previousAnswer = answers[currentQuestionIndex - 1];
      setSelectedAnswer(previousAnswer?.answer || null);
      // Remove last answer from array
      setAnswers(prev => prev.slice(0, -1));
    }
  };

  const scaleLabels = [
    'Strongly Disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly Agree',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={currentQuestionIndex === 0 ? onBack : handlePrevious}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-slate-900">Assessment Questions</h1>
                <p className="text-sm text-slate-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Card className="border-2 border-slate-200">
          <div className="p-8 md:p-12 space-y-8">
            {/* Question */}
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                {getCategoryLabel(currentQuestion.category)}
              </div>
              <h2 className="text-slate-900 text-2xl">
                {currentQuestion.question}
              </h2>
              <p className="text-slate-600">
                Rate how much you agree with this statement about your relationship with {partnerInfo.partnerName}
              </p>
            </div>

            {/* Answer Options - Mobile Optimized */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedAnswer === value
                      ? 'border-pink-600 bg-pink-50 shadow-lg'
                      : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === value
                          ? 'border-pink-600 bg-pink-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedAnswer === value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{scaleLabels[value - 1]}</p>
                      <p className="text-sm text-slate-600">{value} / 5</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={currentQuestionIndex === 0 ? onBack : handlePrevious}
                variant="outline"
                className="flex-1"
              >
                {currentQuestionIndex === 0 ? 'Back' : 'Previous'}
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === questions.length - 1 ? 'View Results' : 'Next Question'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-slate-50 border-slate-200">
          <div className="p-6 text-center">
            <p className="text-sm text-slate-600">
              <span className="font-medium">💡 Tip:</span> Answer honestly based on how things 
              actually are, not how you wish they were. This gives you the most accurate insights.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    communication: 'Communication',
    conflict: 'Conflict Resolution',
    emotional: 'Emotional Intimacy',
    trust: 'Trust & Security',
    values: 'Shared Values',
    affection: 'Physical Affection',
  };
  return labels[category] || category;
}
