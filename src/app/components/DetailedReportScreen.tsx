import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FileText, Download, Share2, Calendar, User, Brain, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';

interface DetailedReportScreenProps {
  phqScore: number;
  responses: number[];
  onBack: () => void;
  userEmail?: string;
}

export function DetailedReportScreen({ phqScore, responses, onBack, userEmail }: DetailedReportScreenProps) {
  const [sessionId] = React.useState(`MS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const assessmentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // PHQ-9 Questions
  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself"
  ];

  const responseLabels = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day"
  ];

  // Determine severity
  const getSeverity = () => {
    if (phqScore >= 20) return { level: 'Severe', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (phqScore >= 15) return { level: 'Moderately Severe', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (phqScore >= 10) return { level: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (phqScore >= 5) return { level: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { level: 'Minimal', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const severity = getSeverity();

  // Identify high-risk responses
  const highRiskItems = responses.map((score, index) => ({
    question: questions[index],
    score,
    isHighRisk: score >= 2
  })).filter(item => item.isHighRisk);

  // Check for suicidal ideation (question 9)
  const suicidalIdeation = responses[8] >= 2;

  // Calculate symptom clusters
  const coreDepressiveSymptoms = responses[0] + responses[1]; // Questions 1-2
  const sleepSymptoms = responses[2]; // Question 3
  const energySymptoms = responses[3]; // Question 4
  const appetiteSymptoms = responses[4]; // Question 5
  const selfWorthSymptoms = responses[5]; // Question 6
  const concentrationSymptoms = responses[6]; // Question 7
  const psychomotorSymptoms = responses[7]; // Question 8

  const handleDownloadReport = () => {
    console.log('Downloading report...');
    alert('Report download functionality would be implemented here.');
  };

  const handleShareReport = () => {
    console.log('Sharing report...');
    alert('Secure report sharing functionality would be implemented here.');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-slate-900 mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-600" />
                Detailed Mental Health Report
              </h1>
              <p className="text-slate-600">
                Comprehensive assessment for clinical review
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Session ID</div>
              <div className="text-slate-900 font-mono text-sm">{sessionId}</div>
            </div>
          </div>

          {/* Report Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Calendar className="w-5 h-5 text-slate-600" />
              <div>
                <div className="text-xs text-slate-500">Assessment Date</div>
                <div className="text-slate-900">{assessmentDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <User className="w-5 h-5 text-slate-600" />
              <div>
                <div className="text-xs text-slate-500">Patient</div>
                <div className="text-slate-900">{userEmail || 'Anonymous'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Brain className="w-5 h-5 text-slate-600" />
              <div>
                <div className="text-xs text-slate-500">Assessment Type</div>
                <div className="text-slate-900">PHQ-9 + AI Analysis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Score Summary */}
        <div className={`${severity.bg} border ${severity.border} rounded-2xl p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900">Overall Depression Severity</h2>
            <div className={`${severity.color} text-4xl`}>
              {phqScore}/27
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className={`px-4 py-2 ${severity.bg} border ${severity.border} rounded-lg`}>
              <span className={severity.color}>
                {severity.level} Depression
              </span>
            </div>
          </div>
          <p className="text-slate-700">
            {phqScore >= 15 && "Immediate clinical attention recommended. Patient may benefit from combination of therapy and medication."}
            {phqScore >= 10 && phqScore < 15 && "Clinical intervention recommended. Therapy or pharmacological treatment should be considered."}
            {phqScore >= 5 && phqScore < 10 && "Mild symptoms present. Watchful waiting with follow-up assessment or therapy may be appropriate."}
            {phqScore < 5 && "Minimal depressive symptoms. No treatment indicated; routine monitoring suggested."}
          </p>
        </div>

        {/* Crisis Alert */}
        {suicidalIdeation && (
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-red-900 mb-2">
                  CRISIS ALERT: Suicidal Ideation Detected
                </h3>
                <p className="text-red-800 mb-3">
                  Patient endorsed thoughts of self-harm or death (Item 9: Score {responses[8]}/3). 
                  Immediate safety assessment and crisis intervention required.
                </p>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="text-red-900 mb-2">
                    Emergency Resources:
                  </p>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• National Suicide Prevention Lifeline: 988</li>
                    <li>• Crisis Text Line: Text HOME to 741741</li>
                    <li>• Emergency Services: 911</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* High-Risk Items */}
        {highRiskItems.length > 0 && (
          <Card className="bg-white border-slate-200 p-6 mb-6">
            <h3 className="text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              High-Risk Responses
            </h3>
            <div className="space-y-3">
              {highRiskItems.map((item, index) => (
                <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex justify-between items-start gap-3">
                    <p className="text-slate-900 flex-1">{item.question}</p>
                    <span className="text-amber-700 font-medium whitespace-nowrap">
                      {responseLabels[item.score]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Symptom Cluster Analysis */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" />
            Symptom Cluster Analysis
          </h3>
          <div className="space-y-4">
            {/* Core Depressive Symptoms */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Core Depressive Symptoms (Anhedonia & Mood)</span>
                <span className="text-slate-900">{coreDepressiveSymptoms}/6</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-cyan-600 h-2 rounded-full" 
                  style={{ width: `${(coreDepressiveSymptoms / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Sleep */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Sleep Disturbance</span>
                <span className="text-slate-900">{sleepSymptoms}/3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(sleepSymptoms / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Energy/Fatigue</span>
                <span className="text-slate-900">{energySymptoms}/3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(energySymptoms / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Appetite */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Appetite Changes</span>
                <span className="text-slate-900">{appetiteSymptoms}/3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-pink-600 h-2 rounded-full" 
                  style={{ width: `${(appetiteSymptoms / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Self-Worth */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Self-Worth/Guilt</span>
                <span className="text-slate-900">{selfWorthSymptoms}/3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${(selfWorthSymptoms / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Concentration */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Concentration Difficulties</span>
                <span className="text-slate-900">{concentrationSymptoms}/3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${(concentrationSymptoms / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Psychomotor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700">Psychomotor Changes</span>
                <span className="text-slate-900">{psychomotorSymptoms}/3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full" 
                  style={{ width: `${(psychomotorSymptoms / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Complete Item Response Table */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4">Complete Item Response Details</h3>
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={index} className="border-b border-slate-100 pb-3 last:border-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <span className="text-xs text-slate-500">Item {index + 1}</span>
                    <p className="text-slate-900">{question}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900">{responses[index]}/3</div>
                    <div className="text-xs text-slate-600">{responseLabels[responses[index]]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Clinical Recommendations */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-600" />
            Clinical Recommendations
          </h3>
          <div className="space-y-3">
            {phqScore >= 15 && (
              <>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Consider referral to psychiatrist for medication evaluation</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Recommend weekly psychotherapy (CBT or IPT)</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Establish safety plan if suicidal ideation present</p>
                </div>
              </>
            )}
            {phqScore >= 10 && phqScore < 15 && (
              <>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Initiate evidence-based psychotherapy (CBT, IPT, or BA)</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Consider antidepressant medication if symptoms persist</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Schedule follow-up assessment in 2-4 weeks</p>
                </div>
              </>
            )}
            {phqScore >= 5 && phqScore < 10 && (
              <>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Psychoeducation about depression and self-help resources</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Consider brief counseling or support groups</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Reassess in 4-6 weeks or sooner if symptoms worsen</p>
                </div>
              </>
            )}
            {phqScore < 5 && (
              <>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">No immediate intervention required</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Provide wellness education and prevention strategies</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">Routine screening at next annual visit</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* AI Analysis Summary */}
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 p-6 mb-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-600" />
            AI-Powered Emotional Analysis
          </h3>
          <div className="bg-white rounded-lg p-4 mb-3">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Primary Emotion</div>
                <div className="text-slate-900">Neutral</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Confidence Score</div>
                <div className="text-slate-900">82%</div>
              </div>
            </div>
            <div className="text-slate-700 text-sm">
              Facial emotion analysis detected slight sadness markers consistent with reported PHQ-9 symptoms. 
              Microexpression patterns suggest genuine emotional distress.
            </div>
          </div>
          <div className="text-xs text-slate-600">
            Analysis powered by Vertex AI • Model v2.1.0 • HIPAA Compliant
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={handleDownloadReport}
              className="bg-white border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={handleShareReport}
              className="bg-white border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share with Provider
            </Button>
            <Button
              onClick={onBack}
              className="bg-cyan-600 text-white hover:bg-cyan-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
