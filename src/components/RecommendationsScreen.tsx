import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Phone, Calendar, AlertCircle } from 'lucide-react';

interface RecommendationsScreenProps {
  phqScore: number;
  onBookSession: (counselorId: string) => void;
  onEmergencyContact: () => void;
}

const counselors = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    credentials: 'Licensed Clinical Psychologist',
    specialties: ['Depression', 'Anxiety', 'CBT'],
    availability: 'Next available: Tomorrow, 2:00 PM',
    matchScore: 95,
  },
  {
    id: '2',
    name: 'Dr. Michael Torres',
    credentials: 'Licensed Therapist, LMFT',
    specialties: ['Mood Disorders', 'Stress Management'],
    availability: 'Next available: Wed, 10:00 AM',
    matchScore: 88,
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    credentials: 'Psychiatric Nurse Practitioner',
    specialties: ['Medication Management', 'Depression'],
    availability: 'Next available: Thu, 3:30 PM',
    matchScore: 82,
  },
];

export function RecommendationsScreen({
  phqScore,
  onBookSession,
  onEmergencyContact,
}: RecommendationsScreenProps) {
  const isHighRisk = phqScore >= 15;

  return (
    <div className="flex flex-col min-h-screen pb-4">
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <h2 className="text-slate-900 mb-1">Counselor Recommendations</h2>
        <p className="text-slate-600">
          Matched based on your assessment results.
        </p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Emergency Banner for High Risk */}
        {isHighRisk && (
          <Card className="border-red-200 bg-red-50">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-red-900 mb-1">Immediate Support Available</h3>
                  <p className="text-red-800">
                    If you're in crisis, please reach out for immediate help.
                  </p>
                </div>
              </div>
              <Button
                onClick={onEmergencyContact}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Emergency Hotline: 988
              </Button>
            </div>
          </Card>
        )}

        {/* Treatment Recommendation */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Recommended Treatment Plan</h3>
            <div className="space-y-2 text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p>Weekly therapy sessions (8-12 weeks recommended)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p>Cognitive Behavioral Therapy (CBT) approach</p>
              </div>
              {phqScore >= 10 && (
                <div className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">•</span>
                  <p>Consider medication evaluation if symptoms persist</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Counselor List */}
        <div className="space-y-3">
          <h3 className="text-slate-900 px-1">Available Counselors</h3>
          {counselors.map((counselor) => (
            <Card key={counselor.id} className="border-slate-200 bg-white">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-slate-900 mb-1">{counselor.name}</h4>
                    <p className="text-slate-600">{counselor.credentials}</p>
                  </div>
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 border-0">
                    {counselor.matchScore}% match
                  </Badge>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {counselor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="outline"
                        className="border-slate-300 text-slate-700"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{counselor.availability}</span>
                  </div>
                </div>

                <Button
                  onClick={() => onBookSession(counselor.id)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Book Session
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Self-Care Resources</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors">
                Daily Mood Tracking Journal
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors">
                Guided Meditation Library
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors">
                Educational Articles on Depression
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
