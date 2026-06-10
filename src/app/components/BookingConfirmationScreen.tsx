import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, Calendar, Clock, Video, Shield, Lock, Database, Heart } from 'lucide-react';

interface BookingConfirmationScreenProps {
  counselorName: string;
  onComplete: () => void;
  onViewSelfCare?: () => void;
}

export function BookingConfirmationScreen({
  counselorName,
  onComplete,
  onViewSelfCare,
}: BookingConfirmationScreenProps) {
  const sessionDetails = {
    date: 'Tomorrow, Nov 18, 2025',
    time: '2:00 PM - 3:00 PM EST',
    sessionNumber: 'MS-2025-1147',
    meetingLink: 'mindlens.meet/secure-abc123',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-5 h-5 text-cyan-600" />
          <h2 className="text-slate-900">Booking Confirmed</h2>
        </div>
        <p className="text-slate-600">Your session has been scheduled.</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Session Details */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-4">Session Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-slate-600">Date</p>
                  <p className="text-slate-900">{sessionDetails.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-slate-600">Time</p>
                  <p className="text-slate-900">{sessionDetails.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-slate-600 mt-0.5" />
                <div>
                  <p className="text-slate-600">Counselor</p>
                  <p className="text-slate-900">{counselorName}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-slate-600 mb-1">Session ID</p>
              <p className="text-slate-900 font-mono text-sm">{sessionDetails.sessionNumber}</p>
            </div>
          </div>
        </Card>

        {/* End-to-End Encryption */}
        <Card className="border-cyan-200 bg-cyan-50">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-cyan-700" />
              <h3 className="text-cyan-900">End-to-End Encrypted</h3>
            </div>
            <p className="text-cyan-800 mb-3">
              Your session and all communications are protected with AES-256 encryption. Only you and your counselor can access the conversation.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-cyan-300 text-cyan-800 bg-white">
                TLS 1.3
              </Badge>
              <Badge variant="outline" className="border-cyan-300 text-cyan-800 bg-white">
                AES-256-GCM
              </Badge>
              <Badge variant="outline" className="border-cyan-300 text-cyan-800 bg-white">
                HIPAA Compliant
              </Badge>
            </div>
          </div>
        </Card>

        {/* Data Security & Storage */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-slate-700" />
              <h3 className="text-slate-900">Data Security</h3>
            </div>
            <div className="space-y-3 text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p className="text-slate-700">All data encrypted and stored securely</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p className="text-slate-700">HIPAA-compliant data handling</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p className="text-slate-700">Your privacy is our top priority</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Safety Features */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-slate-700" />
              <h3 className="text-slate-900">Safety Features Active</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Crisis Detection AI</span>
                <Badge className="bg-green-100 text-green-700 border-0">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">24/7 Emergency Access</span>
                <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">Session Recording (Optional)</span>
                <Badge className="bg-slate-200 text-slate-700 border-0">Off</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Pre-Session Preparation */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Before Your Session</h3>
            <div className="space-y-2 text-slate-700">
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p>Test your video and audio connection</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p>Find a private, quiet space</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p>Have your assessment results ready if needed</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-600 mt-1">•</span>
                <p>Join 5 minutes early to check technical setup</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Meeting Link */}
        <Card className="border-cyan-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-2">Secure Meeting Link</h3>
            <p className="text-slate-600 mb-3">
              This encrypted link will be active 15 minutes before your session.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3">
              <p className="text-slate-900 font-mono text-sm break-all">
                {sessionDetails.meetingLink}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full border-slate-300 text-slate-700"
            >
              Copy Link
            </Button>
          </div>
        </Card>

        {/* Calendar Integration */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-slate-300 text-slate-700">
            Add to Calendar
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-700">
            Send Reminder
          </Button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
        <Button
          onClick={onComplete}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Return to Dashboard
        </Button>
        {onViewSelfCare && (
          <Button
            onClick={onViewSelfCare}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white mt-2"
          >
            <Heart className="w-5 h-5 mr-2" />
            View Self-Care Tips
          </Button>
        )}
      </div>
    </div>
  );
}