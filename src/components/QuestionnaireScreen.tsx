import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';

interface QuestionnaireScreenProps {
  onSubmit: (responses: number[]) => void;
}

const questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

const scaleLabels = [
  'Not at all',
  'Several days',
  'More than half the days',
  'Nearly every day',
];

export function QuestionnaireScreen({ onSubmit }: QuestionnaireScreenProps) {
  const [responses, setResponses] = useState<(number | null)[]>(Array(9).fill(null));

  const handleResponseChange = (questionIndex: number, value: number) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = value;
    setResponses(newResponses);
  };

  const answeredCount = responses.filter((r) => r !== null).length;
  const progress = (answeredCount / 9) * 100;
  const allAnswered = answeredCount === 9;

  const handleSubmit = () => {
    if (allAnswered) {
      onSubmit(responses as number[]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <div className="mb-3">
          <h2 className="text-slate-900 mb-1">PHQ-9 Questionnaire</h2>
          <p className="text-slate-600">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900">{answeredCount}/9</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 px-6 py-6 pb-24">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={index} className="border-slate-200 bg-white">
              <div className="p-5">
                <p className="text-slate-900 mb-4">
                  <span className="text-cyan-600 mr-2">{index + 1}.</span>
                  {question}
                </p>
                <RadioGroup
                  value={responses[index]?.toString() ?? ''}
                  onValueChange={(value) => handleResponseChange(index, parseInt(value))}
                >
                  <div className="space-y-3">
                    {scaleLabels.map((label, scaleIndex) => (
                      <div key={scaleIndex} className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={scaleIndex.toString()}
                          id={`q${index}-${scaleIndex}`}
                        />
                        <Label
                          htmlFor={`q${index}-${scaleIndex}`}
                          className="text-slate-700 cursor-pointer flex-1"
                        >
                          {label}
                        </Label>
                        <span className="text-slate-500 text-sm">{scaleIndex}</span>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
        >
          Submit Responses
        </Button>
      </div>
    </div>
  );
}
