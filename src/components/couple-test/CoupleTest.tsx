import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { PartnerInfoScreen } from './PartnerInfoScreen';
import { QuestionnaireScreen } from './QuestionnaireScreen';
import { ResultsScreen } from './ResultsScreen';

export interface PartnerInfo {
  yourName: string;
  partnerName: string;
  relationshipLength: string;
  relationshipType: string;
}

export interface Answer {
  questionId: number;
  question: string;
  answer: number; // 1-5 scale
  category: string;
}

export interface CoupleTestResults {
  answers: Answer[];
  scores: {
    communication: number;
    conflictResolution: number;
    emotionalIntimacy: number;
    trustAndSecurity: number;
    sharedValues: number;
    physicalAffection: number;
    overallCompatibility: number;
  };
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  partnerInfo: PartnerInfo;
  completedAt: string;
}

interface CoupleTestProps {
  onBack: () => void;
  onComplete: (results: CoupleTestResults) => void;
}

type Screen = 'welcome' | 'partner-info' | 'questionnaire' | 'results';

export function CoupleTest({ onBack, onComplete }: CoupleTestProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<CoupleTestResults | null>(null);

  const handleStartTest = () => {
    setCurrentScreen('partner-info');
  };

  const handlePartnerInfoComplete = (info: PartnerInfo) => {
    setPartnerInfo(info);
    setCurrentScreen('questionnaire');
  };

  const handleQuestionnaireComplete = (completedAnswers: Answer[]) => {
    setAnswers(completedAnswers);
    const calculatedResults = calculateResults(completedAnswers, partnerInfo!);
    setResults(calculatedResults);
    setCurrentScreen('results');
  };

  const handleViewResults = () => {
    if (results) {
      onComplete(results);
    }
  };

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStartTest} onBack={onBack} />
      )}
      {currentScreen === 'partner-info' && (
        <PartnerInfoScreen
          onComplete={handlePartnerInfoComplete}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}
      {currentScreen === 'questionnaire' && partnerInfo && (
        <QuestionnaireScreen
          partnerInfo={partnerInfo}
          onComplete={handleQuestionnaireComplete}
          onBack={() => setCurrentScreen('partner-info')}
        />
      )}
      {currentScreen === 'results' && results && (
        <ResultsScreen
          results={results}
          onViewDetailed={handleViewResults}
          onRetake={() => {
            setCurrentScreen('welcome');
            setAnswers([]);
            setPartnerInfo(null);
            setResults(null);
          }}
        />
      )}
    </>
  );
}

// Helper function to calculate results
function calculateResults(answers: Answer[], partnerInfo: PartnerInfo): CoupleTestResults {
  // Group answers by category
  const categories = {
    communication: answers.filter(a => a.category === 'communication'),
    conflictResolution: answers.filter(a => a.category === 'conflict'),
    emotionalIntimacy: answers.filter(a => a.category === 'emotional'),
    trustAndSecurity: answers.filter(a => a.category === 'trust'),
    sharedValues: answers.filter(a => a.category === 'values'),
    physicalAffection: answers.filter(a => a.category === 'affection'),
  };

  // Calculate average score for each category (0-100)
  const scores = {
    communication: calculateCategoryScore(categories.communication),
    conflictResolution: calculateCategoryScore(categories.conflictResolution),
    emotionalIntimacy: calculateCategoryScore(categories.emotionalIntimacy),
    trustAndSecurity: calculateCategoryScore(categories.trustAndSecurity),
    sharedValues: calculateCategoryScore(categories.sharedValues),
    physicalAffection: calculateCategoryScore(categories.physicalAffection),
    overallCompatibility: 0,
  };

  // Calculate overall compatibility (weighted average)
  scores.overallCompatibility = Math.round(
    (scores.communication * 0.20 +
      scores.conflictResolution * 0.15 +
      scores.emotionalIntimacy * 0.20 +
      scores.trustAndSecurity * 0.20 +
      scores.sharedValues * 0.15 +
      scores.physicalAffection * 0.10)
  );

  // Determine strengths (scores >= 75)
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (scores.communication >= 75) strengths.push('Excellent Communication');
  else if (scores.communication < 60) growthAreas.push('Communication Skills');

  if (scores.conflictResolution >= 75) strengths.push('Healthy Conflict Resolution');
  else if (scores.conflictResolution < 60) growthAreas.push('Conflict Management');

  if (scores.emotionalIntimacy >= 75) strengths.push('Deep Emotional Connection');
  else if (scores.emotionalIntimacy < 60) growthAreas.push('Emotional Intimacy');

  if (scores.trustAndSecurity >= 75) strengths.push('Strong Trust & Security');
  else if (scores.trustAndSecurity < 60) growthAreas.push('Building Trust');

  if (scores.sharedValues >= 75) strengths.push('Aligned Values & Goals');
  else if (scores.sharedValues < 60) growthAreas.push('Values Alignment');

  if (scores.physicalAffection >= 75) strengths.push('Satisfying Physical Connection');
  else if (scores.physicalAffection < 60) growthAreas.push('Physical Intimacy');

  // Generate recommendations
  const recommendations = generateRecommendations(scores, growthAreas);

  return {
    answers,
    scores,
    strengths,
    growthAreas,
    recommendations,
    partnerInfo,
    completedAt: new Date().toISOString(),
  };
}

function calculateCategoryScore(categoryAnswers: Answer[]): number {
  if (categoryAnswers.length === 0) return 0;
  const sum = categoryAnswers.reduce((acc, a) => acc + a.answer, 0);
  const maxPossible = categoryAnswers.length * 5;
  return Math.round((sum / maxPossible) * 100);
}

function generateRecommendations(
  scores: CoupleTestResults['scores'],
  growthAreas: string[]
): string[] {
  const recommendations: string[] = [];

  if (growthAreas.includes('Communication Skills')) {
    recommendations.push('Practice active listening: Give your partner your full attention without planning your response.');
    recommendations.push('Use "I feel" statements instead of "You always/never" to express concerns.');
  }

  if (growthAreas.includes('Conflict Management')) {
    recommendations.push('Set ground rules for arguments: No name-calling, take breaks if needed, focus on solutions.');
    recommendations.push('Learn to fight fair: Address the issue, not the person.');
  }

  if (growthAreas.includes('Emotional Intimacy')) {
    recommendations.push('Schedule regular quality time together without distractions.');
    recommendations.push('Share your feelings, fears, and dreams more openly with each other.');
  }

  if (growthAreas.includes('Building Trust')) {
    recommendations.push('Keep your promises, even small ones. Consistency builds trust.');
    recommendations.push('Be transparent about your feelings, actions, and decisions.');
  }

  if (growthAreas.includes('Values Alignment')) {
    recommendations.push('Have open discussions about your long-term goals and life priorities.');
    recommendations.push('Find ways to honor both partners\' important values.');
  }

  if (growthAreas.includes('Physical Intimacy')) {
    recommendations.push('Discuss your needs and preferences openly without judgment.');
    recommendations.push('Show non-sexual affection daily: hugs, kisses, holding hands.');
  }

  // Add general recommendations
  if (scores.overallCompatibility >= 75) {
    recommendations.push('Keep nurturing what\'s working! Regular date nights help maintain connection.');
  } else if (scores.overallCompatibility >= 60) {
    recommendations.push('Consider couples counseling to strengthen your relationship foundation.');
  } else {
    recommendations.push('Seek professional couples therapy to address underlying issues.');
  }

  return recommendations;
}
